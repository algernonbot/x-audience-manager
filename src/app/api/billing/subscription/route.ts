import { NextResponse } from "next/server";
import { createSubscription } from "@/server/store";

export async function POST() {
  const subscription = createSubscription();
  return NextResponse.json({ ok: true, accessType: "subscription", subscription });
}

export async function GET() {
  const subscription = createSubscription();
  return NextResponse.json({ ok: true, accessType: "subscription", subscription });
}
