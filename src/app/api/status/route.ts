import { NextResponse } from "next/server";
import { loadSiteContent } from "@/lib/site-config";

export const runtime = "nodejs";

/** GET /api/status — platform status (config-driven, monitoring-ready). */
export async function GET() {
  const content = loadSiteContent();
  const summary = content.status.items.every((i) => i.status === "operational")
    ? "operational"
    : "issues";

  return NextResponse.json({
    summary,
    updatedAt: new Date().toISOString(),
    source: "config",
    items: content.status.items,
  });
}
