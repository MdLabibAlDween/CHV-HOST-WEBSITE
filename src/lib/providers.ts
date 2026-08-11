import type { HostingPlan, PlanCategory, BillingCycle } from "@/lib/site-types";
import { loadPlans } from "@/lib/site-config";
import { whmcsRequest } from "@/lib/whmcs";
import { getEnv } from "@/lib/env";
import { log } from "@/lib/logger";

/**
 * Unified product/pricing provider.
 *
 * When WHMCS is configured (USE_WHMCS_PRODUCTS=true and credentials
 * present), products are fetched from WHMCS. Otherwise — or when WHMCS
 * is unreachable — the configurable local catalog is used so the site
 * always renders. WHMCS remains the source of truth once connected.
 */

const CATEGORY_BY_GROUP: Record<string, PlanCategory> = {
  "Web Hosting": "web",
  "Shared Hosting": "web",
  Hosting: "web",
  "BDIX Hosting": "bdix",
  "Turbo Hosting": "turbo",
  "Reseller Hosting": "reseller",
  VPS: "vps",
  "BDIX VPS": "bdix-vps",
};

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}

/**
 * Best-effort mapping of WHMCS GetProducts output to our plan model.
 * WHMCS product structure varies by version, so this is defensive and
 * falls back to the local catalog on any failure.
 */
function mapWhmcsProducts(raw: Record<string, unknown>): HostingPlan[] | null {
  const products = raw.products as Record<string, Record<string, unknown>> | undefined;
  if (!products || typeof products !== "object") return null;

  const plans: HostingPlan[] = [];

  for (const [pid, product] of Object.entries(products)) {
    if (!product || typeof product !== "object") continue;
    const name = typeof product.name === "string" ? product.name : `Plan ${pid}`;
    const group = typeof product.groupname === "string" ? product.groupname : "";
    const category = CATEGORY_BY_GROUP[normalizeName(group) === group ? group : Object.keys(CATEGORY_BY_GROUP).find((k) => normalizeName(k) === normalizeName(group)) ?? "web"] ?? "web";

    const pricingRaw = product.pricing as Record<string, unknown> | undefined;
    const prices: HostingPlan["prices"] = { bdt: {}, usd: {} };
    if (pricingRaw && typeof pricingRaw === "object") {
      for (const [cycle, value] of Object.entries(pricingRaw)) {
        if (!value || typeof value !== "object") continue;
        const v = value as Record<string, unknown>;
        const bdtPrice = typeof v.bdt === "string" ? Number(v.bdt) : undefined;
        const usdPrice = typeof v.usd === "string" ? Number(v.usd) : undefined;
        const billingCycle = cycle as BillingCycle;
        if (bdtPrice && Number.isFinite(bdtPrice)) prices.bdt[billingCycle] = bdtPrice;
        if (usdPrice && Number.isFinite(usdPrice)) prices.usd[billingCycle] = usdPrice;
      }
    }

    const billingCycles = (Object.keys(prices.bdt).length ? Object.keys(prices.bdt) : Object.keys(prices.usd)) as HostingPlan["billingCycles"];
    if (billingCycles.length === 0) continue;

    plans.push({
      id: `whmcs-${pid}`,
      category,
      name,
      tagline: typeof product.description === "string" ? product.description.slice(0, 120) : "",
      whmcsPid: Number(pid),
      billingCycles,
      prices,
      features: [],
      resourceSpecs: [],
    });
  }

  return plans.length > 0 ? plans : null;
}

/** Fetch plans: WHMCS first (when enabled), local catalog as fallback. */
export async function fetchPlans(): Promise<{ plans: HostingPlan[]; source: "whmcs" | "catalog" | "unavailable" }> {
  const env = getEnv();

  if (env.useWhmcsProducts && env.whmcsApiUrl && env.whmcsIdentifier && env.whmcsSecret) {
    const result = await whmcsRequest("GetProducts", {});
    if (result.ok) {
      const mapped = mapWhmcsProducts(result.data);
      if (mapped) return { plans: mapped, source: "whmcs" };
      log("WHMCS_RESPONSE", { note: "GetProducts returned no mappable products; using catalog fallback." });
    }
    return { plans: loadPlans(), source: "unavailable" };
  }

  return { plans: loadPlans(), source: "catalog" };
}

export function plansByCategory(plans: HostingPlan[], category: PlanCategory): HostingPlan[] {
  return plans.filter((p) => p.category === category);
}
