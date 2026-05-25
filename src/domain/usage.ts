export type UsageEvent = {
  eventType: "scan_records" | "cleanup_action" | "estimated_x_cost";
  quantity: number;
  estimatedCostCents: number;
  metadata?: Record<string, string | number | boolean>;
  createdAt?: Date;
};

export function estimateOwnedReadCostCents(records: number): number {
  return Math.ceil(records * 0.1);
}
