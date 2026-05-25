import { describe, expect, it } from "vitest";
import { runPreviewScan } from "./scan";
import { createMockXProvider } from "./mock-x";

describe("runPreviewScan", () => {
  it("caps free preview scans and records estimated cost usage", async () => {
    const usage: unknown[] = [];
    const result = await runPreviewScan({ provider: createMockXProvider(150), entitlement: { accessType: "free", scanLimit: 100, actionLimit: 25, expiresAt: null, isPaid: false }, recordUsage: (event) => usage.push(event) });
    expect(result.accounts).toHaveLength(100);
    expect(result.scan.recordsFetched).toBe(100);
    expect(usage).toContainEqual(expect.objectContaining({ eventType: "scan_records", quantity: 100 }));
  });
});
