import { NextResponse } from "next/server";
import { createPurgePass } from "@/server/store";

export async function POST() {
  const pass = createPurgePass();
  return NextResponse.json({ ok: true, accessType: "purge_pass", pass });
}

export async function GET() {
  const pass = createPurgePass();
  return NextResponse.json({ ok: true, accessType: "purge_pass", pass });
}
