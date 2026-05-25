export type AccessType = "free" | "purge_pass" | "subscription";

export type AccessPass = {
  status: "active" | "expired" | "cancelled";
  startsAt: Date;
  expiresAt: Date;
  includedScanLimit: number;
  includedActionLimit: number;
};

export type Subscription = {
  status: "active" | "trialing" | "past_due" | "canceled";
  plan: "starter" | "pro";
  currentPeriodEnd: Date;
};

export type Entitlement = {
  accessType: AccessType;
  scanLimit: number;
  actionLimit: number;
  expiresAt: Date | null;
  isPaid: boolean;
};

export function calculateEntitlement(input: { now: Date; passes: AccessPass[]; subscription: Subscription | null }): Entitlement {
  const activeSubscription = input.subscription && ["active", "trialing"].includes(input.subscription.status) && input.subscription.currentPeriodEnd > input.now ? input.subscription : null;
  if (activeSubscription) {
    return { accessType: "subscription", scanLimit: activeSubscription.plan === "pro" ? 10000 : 2500, actionLimit: activeSubscription.plan === "pro" ? 2000 : 500, expiresAt: activeSubscription.currentPeriodEnd, isPaid: true };
  }

  const activePass = input.passes
    .filter((pass) => pass.status === "active" && pass.startsAt <= input.now && pass.expiresAt > input.now)
    .sort((a, b) => b.expiresAt.getTime() - a.expiresAt.getTime())[0];
  if (activePass) {
    return { accessType: "purge_pass", scanLimit: activePass.includedScanLimit, actionLimit: activePass.includedActionLimit, expiresAt: activePass.expiresAt, isPaid: true };
  }

  return { accessType: "free", scanLimit: 100, actionLimit: 25, expiresAt: null, isPaid: false };
}

export function assertWithinActionLimit(usedActions: number, requestedActions: number, entitlement: Entitlement): void {
  if (usedActions + requestedActions > entitlement.actionLimit) {
    throw new Error(`Action limit exceeded: ${usedActions + requestedActions}/${entitlement.actionLimit}`);
  }
}
