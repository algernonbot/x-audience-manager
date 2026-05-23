import { generateCleanupCandidates } from "@/domain/candidates";
import { queueCleanupActions, type CleanupAction } from "@/domain/cleanup";
import { calculateEntitlement, type AccessPass, type Subscription } from "@/domain/entitlements";
import { createMockXProvider } from "@/domain/mock-x";
import { runPreviewScan, type ScanResult } from "@/domain/scan";
import type { UsageEvent } from "@/domain/usage";

export type DemoState = {
  userId: string;
  passes: AccessPass[];
  subscription: Subscription | null;
  safeListedAccountIds: string[];
  usedActions: number;
  usageEvents: UsageEvent[];
  latestScan: ScanResult | null;
  cleanupActions: CleanupAction[];
};

const state: DemoState = {
  userId: "demo-user",
  passes: [],
  subscription: null,
  safeListedAccountIds: ["x-1", "x-4", "x-7"],
  usedActions: 0,
  usageEvents: [],
  latestScan: null,
  cleanupActions: [],
};

export function getDemoState() {
  return state;
}

export function resetDemoUser() {
  state.passes = [];
  state.subscription = null;
  state.usedActions = 0;
  state.usageEvents = [];
  state.latestScan = null;
  state.cleanupActions = [];
  return state;
}

export async function runDemoPreviewScan(requestedLimit = 100, now = new Date()) {
  const entitlement = calculateEntitlement({ now, passes: state.passes, subscription: state.subscription });
  state.latestScan = await runPreviewScan({
    provider: createMockXProvider(150),
    entitlement,
    requestedLimit,
    recordUsage: (event) => state.usageEvents.push(event),
  });
  return { entitlement, scan: state.latestScan, usageEvents: state.usageEvents };
}

export function queueDemoCleanupActions(selectedAccountIds: string[], now = new Date()) {
  const entitlement = calculateEntitlement({ now, passes: state.passes, subscription: state.subscription });
  const result = queueCleanupActions({
    selectedAccountIds,
    usedActions: state.usedActions,
    actionLimit: entitlement.actionLimit,
    safeListedAccountIds: state.safeListedAccountIds,
  });
  state.cleanupActions.push(...result.queued);
  state.usedActions += result.queued.length;
  for (const action of result.queued) {
    state.usageEvents.push({ eventType: "cleanup_action", quantity: 1, estimatedCostCents: 0, metadata: { accountId: action.accountId }, createdAt: now });
  }
  return { entitlement, ...result, usedActions: state.usedActions };
}

export function createPurgePass(now = new Date()) {
  const pass: AccessPass = {
    status: "active",
    startsAt: now,
    expiresAt: new Date(now.getTime() + 48 * 60 * 60 * 1000),
    includedScanLimit: 5000,
    includedActionLimit: 1000,
  };
  state.passes.push(pass);
  return pass;
}

export function createSubscription(now = new Date()) {
  state.subscription = { status: "active", plan: "starter", currentPeriodEnd: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) };
  return state.subscription;
}

export function latestCandidates() {
  return state.latestScan ? generateCleanupCandidates(state.latestScan.accounts, { safeListedAccountIds: state.safeListedAccountIds }) : [];
}
