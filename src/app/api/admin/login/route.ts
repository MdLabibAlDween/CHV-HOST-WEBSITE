import { NextRequest, NextResponse } from "next/server";
import { getEnv } from "@/lib/env";
import { isAdminSession, createAdminSession, destroyAdminSession } from "@/lib/admin-session";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { log } from "@/lib/logger";

export const runtime = "nodejs";

/** POST /api/admin/login {password} -> httpOnly session cookie. */
export async function POST(request: NextRequest) {
  const limit = rateLimit(`admin:${clientKey(request)}`, { max: 10, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const password = (body as Record<string, unknown>)?.password;
  if (typeof password !== "string" || password.length > 256) {
    return NextResponse.json({ error: "Invalid password." }, { status: 400 });
  }

  if (password !== getEnv().adminPassword) {
    log("ADMIN_ACTION", { action: "login_failed" });
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  await createAdminSession();
  log("ADMIN_ACTION", { action: "login" });
  return NextResponse.json({ ok: true });
}

/** GET /api/admin/session -> whether the current session is authenticated. */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  if (url.pathname.endsWith("/logout")) {
    await destroyAdminSession();
    return NextResponse.json({ ok: true });
  }
  const authed = await isAdminSession();
  return NextResponse.json({ authed });
}
