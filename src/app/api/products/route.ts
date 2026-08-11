import { NextRequest, NextResponse } from "next/server";
import { fetchPlans } from "@/lib/providers";

export const runtime = "nodejs";

/** GET /api/products — unified product catalog (WHMCS-first, catalog fallback). */
export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");
  const { plans, source } = await fetchPlans();

  const filtered = category ? plans.filter((p) => p.category === category) : plans;

  return NextResponse.json({
    source,
    plans: filtered,
  });
}
