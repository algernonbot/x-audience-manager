import { describe, expect, it } from "vitest";
import { calculateEntitlement } from "./entitlements";

const now = new Date("2026-05-23T00:00:00Z");

describe("calculateEntitlement", () => {
  it("gives free users a capped preview and 25 cleanup actions", () => {
    expect(calculateEntitlement({ now, passes: [], subscription: null })).toMatchObject({ accessType: "free", scanLimit: 100, actionLimit: 25, isPaid: false });
  });

  it("unlocks a purge pass only until its 48-hour expiration", () => {
    const active = calculateEntitlement({ now, passes: [{ status: "active", startsAt: new Date("2026-05-22T00:00:00Z"), expiresAt: new Date("2026-05-24T00:00:00Z"), includedScanLimit: 5000, includedActionLimit: 1000 }], subscription: null });
    expect(active).toMatchObject({ accessType: "purge_pass", isPaid: true, scanLimit: 5000, actionLimit: 1000 });
    const expired = calculateEntitlement({ now, passes: [{ status: "active", startsAt: new Date("2026-05-20T00:00:00Z"), expiresAt: new Date("2026-05-22T00:00:00Z"), includedScanLimit: 5000, includedActionLimit: 1000 }], subscription: null });
    expect(expired.accessType).toBe("free");
  });

  it("prefers an active subscription over free access", () => {
    expect(calculateEntitlement({ now, passes: [], subscription: { status: "active", plan: "pro", currentPeriodEnd: new Date("2026-06-01T00:00:00Z") } })).toMatchObject({ accessType: "subscription", scanLimit: 10000, actionLimit: 2000, isPaid: true });
  });
});
