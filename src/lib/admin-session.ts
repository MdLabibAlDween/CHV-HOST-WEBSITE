import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Minimal httpOnly cookie session for the /admin content editor.
 * HMAC-signed so the cookie cannot be forged without ADMIN_PASSWORD.
 */

const COOKIE_NAME = "chv_admin_session";

function secret(): string {
  // Stable per-install secret derived from the admin password.
  return createHmac("sha256", "chv-admin").update(process.env.ADMIN_PASSWORD ?? "change-me-before-deploy").digest("hex");
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export async function createAdminSession(): Promise<void> {
  const store = await cookies();
  const payload = `admin:${Date.now()}`;
  const token = `${payload}.${sign(payload)}`;
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8h
  });
}

export async function isAdminSession(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const dot = token.lastIndexOf(".");
  if (dot === -1) return false;
  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function destroyAdminSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
}
