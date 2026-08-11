import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** GET /api/health — liveness check for uptime monitoring / status page. */
export async function GET() {
  return NextResponse.json({ status: "ok", ts: new Date().toISOString() });
}