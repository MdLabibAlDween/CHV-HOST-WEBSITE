import { NextRequest, NextResponse } from "next/server";
import { checkDomain } from "@/lib/domain";
import { rateLimit, clientKey } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const limit = rateLimit(`domains:${clientKey(request)}`, { max: 30, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((limit.retryAfterMs ?? 0) / 1000)) } },
    );
  }

  const q = request.nextUrl.searchParams.get("q")?.trim().slice(0, 63) ?? "";
  const tlds = request.nextUrl.searchParams.get("tlds")?.split(",").filter(Boolean) ?? [];

  if (!q) {
    return NextResponse.json({ error: "Missing domain query." }, { status: 400 });
  }

  const { results, source, tldSource } = await checkDomain(q, { tlds });

  return NextResponse.json({
    query: q,
    results,
    source,
    tldSource,
    note: source === "mock" ? "demo-mode" : "live",
  });
}
