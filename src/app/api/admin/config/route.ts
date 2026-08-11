import { NextRequest, NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-session";
import { loadSiteContent, saveContentOverrides } from "@/lib/site-config";
import { log } from "@/lib/logger";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/** GET /api/admin/config — current merged site content (auth required). */
export async function GET() {
  if (!(await isAdminSession())) return unauthorized();
  return NextResponse.json({ content: loadSiteContent() });
}

/**
 * POST /api/admin/config — save content overrides (auth required).
 * Overrides are merged over defaults at load time and stored in
 * ./content/overrides.json (gitignored).
 */
export async function POST(request: NextRequest) {
  if (!(await isAdminSession())) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const content = (body as Record<string, unknown>)?.content;
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    return NextResponse.json({ error: "Invalid content payload." }, { status: 400 });
  }

  try {
    saveContentOverrides(content);
  } catch {
    return NextResponse.json(
      { error: "Could not write configuration. Check that ./content is writable." },
      { status: 500 },
    );
  }

  log("ADMIN_ACTION", { action: "config_saved", keys: Object.keys(content).slice(0, 10) });
  return NextResponse.json({ ok: true });
}
