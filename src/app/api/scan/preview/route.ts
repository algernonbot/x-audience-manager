import { NextRequest, NextResponse } from "next/server";
import { latestCandidates, runDemoPreviewScan } from "@/server/store";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const requestedLimit = typeof body.requestedLimit === "number" ? body.requestedLimit : 100;
  const result = await runDemoPreviewScan(requestedLimit);
  return NextResponse.json({ ...result, candidates: latestCandidates() });
}
