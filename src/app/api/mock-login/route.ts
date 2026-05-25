import { NextResponse } from "next/server";
import { resetDemoUser } from "@/server/store";

export async function GET() {
  const state = resetDemoUser();
  return NextResponse.json({ ok: true, userId: state.userId, message: "Mock X login complete. No OAuth token was created or logged." });
}
