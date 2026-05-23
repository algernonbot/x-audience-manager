import { describe, expect, it } from "vitest";
import { queueCleanupActions } from "./cleanup";

describe("queueCleanupActions", () => {
  it("queues actions only within remaining entitlement", () => {
    const result = queueCleanupActions({ selectedAccountIds: ["a", "b", "c"], usedActions: 24, actionLimit: 25, safeListedAccountIds: [] });
    expect(result.queued).toEqual([{ accountId: "a", actionType: "unfollow", status: "queued" }]);
    expect(result.rejected).toHaveLength(2);
  });

  it("rejects safe-listed accounts", () => {
    const result = queueCleanupActions({ selectedAccountIds: ["a"], usedActions: 0, actionLimit: 25, safeListedAccountIds: ["a"] });
    expect(result.queued).toHaveLength(0);
    expect(result.rejected[0].reason).toBe("safe_listed");
  });
});
