import type { CleanupCandidate } from "./candidates";
import type { Entitlement } from "./entitlements";
import type { ScanResult } from "./scan";
import type { XProfile } from "./x-provider";

export type UpgradeCard = {
  kind: "purge_pass" | "subscription";
  title: string;
  description: string;
  cta: string;
};

export type DashboardViewModel = {
  hero: {
    name: string;
    username: string;
    accessLabel: string;
  };
  scan: {
    type: ScanResult["scan"]["type"];
    recordsLabel: string;
    estimatedCostLabel: string;
  };
  allowance: {
    actionLimit: number;
    usedActions: number;
    remainingActions: number;
    queuedActions: number;
    label: string;
  };
  candidates: {
    total: number;
    safeListedCount: number;
    topReasons: { code: string; count: number }[];
  };
  upgradeCards: UpgradeCard[];
};

export function buildDashboardViewModel(input: {
  profile: XProfile;
  scan: ScanResult["scan"];
  entitlement: Entitlement;
  candidates: CleanupCandidate[];
  usedActions: number;
  queuedActions: number;
  safeListedCount: number;
}): DashboardViewModel {
  const remainingActions = Math.max(0, input.entitlement.actionLimit - input.usedActions);
  const accessLabel = input.entitlement.accessType === "free" ? "Free preview" : input.entitlement.accessType === "purge_pass" ? "48-hour Purge Pass" : "Subscription";
  const topReasons = Array.from(
    input.candidates.reduce((counts, candidate) => {
      for (const code of candidate.reasonCodes) counts.set(code, (counts.get(code) ?? 0) + 1);
      return counts;
    }, new Map<string, number>()),
  )
    .map(([code, count]) => ({ code, count }))
    .sort((a, b) => b.count - a.count || a.code.localeCompare(b.code))
    .slice(0, 4);

  return {
    hero: { name: input.profile.name, username: `@${input.profile.username}`, accessLabel },
    scan: {
      type: input.scan.type,
      recordsLabel: `${input.scan.recordsFetched} sampled accounts`,
      estimatedCostLabel: `~${input.scan.estimatedCostCents}¢ estimated X API cost`,
    },
    allowance: {
      actionLimit: input.entitlement.actionLimit,
      usedActions: input.usedActions,
      remainingActions,
      queuedActions: input.queuedActions,
      label: `${remainingActions} of ${input.entitlement.actionLimit} ${input.entitlement.accessType === "free" ? "free " : ""}removals left`,
    },
    candidates: { total: input.candidates.length, safeListedCount: input.safeListedCount, topReasons },
    upgradeCards: [
      { kind: "purge_pass", title: "48-hour Purge Pass", description: "Unlock deeper scans and the same cleanup workspace for two days.", cta: "Buy Purge Pass" },
      { kind: "subscription", title: "Subscription", description: "Keep the same workspace open for ongoing scans, safe-listing, and cleanup reports.", cta: "Subscribe" },
    ],
  };
}
