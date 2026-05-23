import type { Entitlement } from "./entitlements";
import type { UsageEvent } from "./usage";
import { estimateOwnedReadCostCents } from "./usage";
import type { XAccount, XProvider, XProfile } from "./x-provider";

export type ScanResult = {
  profile: XProfile;
  accounts: XAccount[];
  scan: { type: "preview"; requestedLimit: number; recordsFetched: number; estimatedCostCents: number; completedAt: Date };
};

export async function runPreviewScan(input: {
  provider: XProvider;
  entitlement: Entitlement;
  recordUsage: (event: UsageEvent) => void;
  requestedLimit?: number;
}): Promise<ScanResult> {
  const requestedLimit = Math.min(input.requestedLimit ?? input.entitlement.scanLimit, input.entitlement.scanLimit);
  const profile = await input.provider.getMe();
  const accounts: XAccount[] = [];
  let cursor: string | null = null;
  while (accounts.length < requestedLimit) {
    const page = await input.provider.getFollowingPage({ cursor, limit: Math.min(100, requestedLimit - accounts.length) });
    accounts.push(...page.data);
    cursor = page.nextCursor;
    if (!cursor || page.data.length === 0) break;
  }
  const estimatedCostCents = estimateOwnedReadCostCents(accounts.length);
  input.recordUsage({ eventType: "scan_records", quantity: accounts.length, estimatedCostCents, metadata: { scanType: "preview" }, createdAt: new Date() });
  return { profile, accounts, scan: { type: "preview", requestedLimit, recordsFetched: accounts.length, estimatedCostCents, completedAt: new Date() } };
}
