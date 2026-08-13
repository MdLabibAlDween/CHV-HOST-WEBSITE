import type { BillingCycle, HostingPlan, PlanCategory } from "@/lib/site-types";
import { loadPlans } from "@/lib/site-config";
import { whmcsRequest } from "@/lib/whmcs";
import { getEnv } from "@/lib/env";
import { log } from "@/lib/logger";

/**
 * Unified product/pricing provider.
 *
 * When WHMCS is configured (USE_WHMCS_PRODUCTS=true and credentials
 * present), products are fetched from WHMCS and are the source of
 * truth for names, prices, currencies and billing cycles. Marketing
 * extras (features, badges, descriptions, icons, order URLs) come from
 * the local catalog, merged by WHMCS product id.
 *
 * Responses are cached for WHMCS_CACHE_TTL_MS (default 120s). When the
 * API is unreachable or the response cannot be parsed, the local
 * catalog is served as a graceful fallback. A successful response with
 * zero products yields an empty plan list so the UI can show a "plans
 * coming soon" state instead of fabricated prices.
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

const CYCLE_KEYS: BillingCycle[] = [
  "monthly",
  "quarterly",
  "semiannually",
  "annually",
  "biennially",
  "triennially",
];

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}

function categoryForGroup(group: string): PlanCategory {
  const normalized = normalizeName(group);
  for (const [key, category] of Object.entries(CATEGORY_BY_GROUP)) {
    if (normalizeName(key) === normalized) return category;
  }
  return "web";
}

function toPrice(value: unknown): number | undefined {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Best-effort mapping of WHMCS GetProducts output to our plan model.
 * WHMCS product structure varies by version, so this is defensive.
 * Returns null on parse failure; an empty array means "no products yet".
 */
function mapWhmcsProducts(raw: Record<string, unknown>): HostingPlan[] | null {
  const products = raw.products as Record<string, Record<string, unknown>> | undefined;
  if (!products || typeof products !== "object") {
    const total = raw.totalresults;
    if (total === "0" || total === 0) return [];
    return null;
  }

  const plans: HostingPlan[] = [];

  for (const [pid, product] of Object.entries(products)) {
    if (!product || typeof product !== "object") continue;
    const name = typeof product.name === "string" ? product.name : `Plan ${pid}`;
    const group = typeof product.groupname === "string" ? product.groupname : "";
    const category = categoryForGroup(group);

    const pricingRaw = product.pricing as Record<string, Record<string, unknown>> | undefined;
    const prices: HostingPlan["prices"] = { bdt: {}, usd: {} };
    if (pricingRaw && typeof pricingRaw === "object") {
      for (const cycle of CYCLE_KEYS) {
        const entry = pricingRaw[cycle];
        if (!entry || typeof entry !== "object") continue;
        const bdtPrice = toPrice(entry.bdt);
        const usdPrice = toPrice(entry.usd);
        if (bdtPrice !== undefined) prices.bdt[cycle] = bdtPrice;
        if (usdPrice !== undefined) prices.usd[cycle] = usdPrice;
      }
    }

    const billingCycles = CYCLE_KEYS.filter(
      (c) => prices.bdt[c] !== undefined || prices.usd[c] !== undefined,
    );
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

  return plans;
}

/** Merge catalog-only marketing fields (features, badges, icons, URLs) by whmcsPid. */
function mergeCatalogExtras(plans: HostingPlan[]): HostingPlan[] {
  const catalogByPid = new Map<number, HostingPlan>();
  for (const plan of loadPlans()) {
    if (plan.whmcsPid !== undefined) catalogByPid.set(plan.whmcsPid, plan);
  }
  return plans.map((plan) => {
    const local = plan.whmcsPid !== undefined ? catalogByPid.get(plan.whmcsPid) : undefined;
    if (!local) return plan;
    return {
      ...plan,
      tagline: local.tagline || plan.tagline,
      features: local.features,
      resourceSpecs: local.resourceSpecs,
      popular: local.popular,
      badge: local.badge,
      customOrderUrl: local.customOrderUrl,
    };
  });
}

export type PlanSource = "whmcs" | "catalog" | "unavailable";

interface FetchResult {
  plans: HostingPlan[];
  source: PlanSource;
  fetchedAt?: number;
}

let cache: { key: string; result: FetchResult; at: number } | null = null;

function cacheKey(): string {
  const env = getEnv();
  return [env.whmcsApiUrl, env.whmcsIdentifier, env.whmcsSecret].join("|");
}

/** Fetch plans: WHMCS first (when enabled, cached), local catalog as fallback. */
export async function fetchPlans(): Promise<FetchResult> {
  const env = getEnv();
  const key = cacheKey();

  if (cache && cache.key === key && Date.now() - cache.at < env.whmcsCacheTtlMs) {
    return cache.result;
  }

  let result: FetchResult;
  if (env.useWhmcsProducts && env.whmcsApiUrl && env.whmcsIdentifier && env.whmcsSecret) {
    const apiResult = await whmcsRequest("GetProducts", {});
    if (apiResult.ok) {
      const mapped = mapWhmcsProducts(apiResult.data);
      if (mapped) {
        result = { plans: mergeCatalogExtras(mapped), source: "whmcs", fetchedAt: Date.now() };
      } else {
        log("WHMCS_RESPONSE", { note: "GetProducts response could not be parsed; using catalog fallback." });
        result = { plans: loadPlans(), source: "unavailable" };
      }
    } else {
      log("WHMCS_RESPONSE", { note: "GetProducts failed; using catalog fallback." });
      result = { plans: loadPlans(), source: "unavailable" };
    }
  } else {
    result = { plans: loadPlans(), source: "catalog" };
  }

  cache = { key, result, at: Date.now() };
  return result;
}

export function plansByCategory(plans: HostingPlan[], category: PlanCategory): HostingPlan[] {
  return plans.filter((p) => p.category === category);
}