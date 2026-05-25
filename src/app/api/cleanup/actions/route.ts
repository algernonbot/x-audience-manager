import { NextRequest, NextResponse } from "next/server";
import { queueDemoCleanupActions } from "@/server/store";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const selectedAccountIds = Array.isArray(body.selectedAccountIds) ? body.selectedAccountIds.filter((id: unknown): id is string => typeof id === "string") : [];
  const result = queueDemoCleanupActions(selectedAccountIds);
  return NextResponse.json(result);
}
