import { describe, expect, it } from "vitest";
import { buildDashboardViewModel } from "./dashboard";
import { calculateEntitlement } from "./entitlements";
import { generateCleanupCandidates } from "./candidates";
import { createMockXProvider } from "./mock-x";
import { runPreviewScan } from "./scan";

describe("buildDashboardViewModel", () => {
  it("summarizes free preview scan, candidates, allowance, and upgrade prompts", async () => {
    const usage: unknown[] = [];
    const entitlement = calculateEntitlement({ now: new Date("2026-05-23T00:00:00Z"), passes: [], subscription: null });
    const scanResult = await runPreviewScan({
      provider: createMockXProvider(150),
      entitlement,
      requestedLimit: 140,
      recordUsage: (event) => usage.push(event),
    });
    const candidates = generateCleanupCandidates(scanResult.accounts, { safeListedAccountIds: ["x-1"] });

    const viewModel = buildDashboardViewModel({
      profile: scanResult.profile,
      scan: scanResult.scan,
      entitlement,
      candidates,
      usedActions: 7,
      queuedActions: 3,
      safeListedCount: 1,
    });

    expect(viewModel.hero.username).toBe("@charles_preview");
    expect(viewModel.scan.recordsLabel).toBe("100 sampled accounts");
    expect(viewModel.allowance.remainingActions).toBe(18);
    expect(viewModel.allowance.label).toBe("18 of 25 free removals left");
    expect(viewModel.candidates.total).toBeGreaterThan(0);
    expect(viewModel.upgradeCards.map((card) => card.kind)).toEqual(["purge_pass", "subscription"]);
  });
});
