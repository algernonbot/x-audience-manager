export type CleanupAction = { accountId: string; actionType: "unfollow"; status: "queued" };
export type RejectedCleanupAction = { accountId: string; reason: "safe_listed" | "entitlement_limit" };

export function queueCleanupActions(input: { selectedAccountIds: string[]; usedActions: number; actionLimit: number; safeListedAccountIds: string[] }): { queued: CleanupAction[]; rejected: RejectedCleanupAction[] } {
  const safe = new Set(input.safeListedAccountIds);
  const queued: CleanupAction[] = [];
  const rejected: RejectedCleanupAction[] = [];
  let remaining = Math.max(0, input.actionLimit - input.usedActions);
  for (const accountId of input.selectedAccountIds) {
    if (safe.has(accountId)) {
      rejected.push({ accountId, reason: "safe_listed" });
      continue;
    }
    if (remaining <= 0) {
      rejected.push({ accountId, reason: "entitlement_limit" });
      continue;
    }
    queued.push({ accountId, actionType: "unfollow", status: "queued" });
    remaining -= 1;
  }
  return { queued, rejected };
}
