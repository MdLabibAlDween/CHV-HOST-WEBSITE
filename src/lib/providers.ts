import type { BillingCycle, HostingPlan, PlanCategory, PriceEntry } from "@/lib/site-types";
import { loadPlans } from "@/lib/site-config";
import { whmcsRequest } from "@/lib/whmcs";
import { getEnv } from "@/lib/env";
import { log } from "@/lib/logger";
import { WHMCS_GROUP_MAP, WHMCS_GID_MAP, FALLBACK_CATEGORY } from "@/config/whmcs-groups";

/**
 * Unified product/pricing provider.
 *
 * When WHMCS is configured (USE_WHMCS_PRODUCTS=true and credentials
 * present), products are fetched from WHMCS and are the source of
 * truth for names, prices, currencies and billing cycles. Marketing
 * extras (badges, "Most Popular", order URLs) come from the local
 * catalog, merged by WHMCS product id — but only when the WHMCS
 * product has no spec list of its own.
 *
 * WHMCS GetProducts (JSON) returns products as an array under
 * `products.product`, with pricing keyed by currency code (BDT/USD),
 * each containing per-cycle prices. A cycle value of -1.00 means the
 * cycle is not enabled; 0.00 is a free (or unset) price.
 *
 * Responses are cached for WHMCS_CACHE_TTL_MS (default 120s). When the
 * API is unreachable or the response cannot be parsed, the local
 * catalog is served as a graceful fallback. A successful response with
 * zero products yields an empty plan list so the UI can show a "plans
 * coming soon" state instead of fabricated prices.
 */

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
  for (const [key, category] of Object.entries(WHMCS_GROUP_MAP)) {
    if (normalizeName(key) === normalized) return category;
  }
  return FALLBACK_CATEGORY;
}

/** Resolve a product's category: explicit gid map first, then groupname, then fallback. */
function categoryForProduct(p: Record<string, unknown>): PlanCategory {
  const gid = typeof p.gid === "string" ? p.gid : String(p.gid ?? "");
  if (gid && WHMCS_GID_MAP[gid]) return WHMCS_GID_MAP[gid];
  if (typeof p.groupname === "string" && p.groupname) return categoryForGroup(p.groupname);
  return FALLBACK_CATEGORY;
}

/** Split a WHMCS product description (newline-separated spec list) into card features. */
function descriptionLines(desc: unknown): string[] {
  if (typeof desc !== "string") return [];
  return desc
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/\s+/g, " "))
    .filter(Boolean)
    .slice(0, 14);
}

/** Extract per-currency, per-cycle prices. -1.00 = cycle disabled. */
function currencyPricing(pricingRaw: unknown): { prices: PriceEntry; cycles: BillingCycle[] } {
  const prices: PriceEntry = { bdt: {}, usd: {} };
  const cycles = new Set<BillingCycle>();
  if (!pricingRaw || typeof pricingRaw !== "object") return { prices, cycles: [] };

  for (const [code, entry] of Object.entries(pricingRaw as Record<string, Record<string, unknown>>)) {
    const key = code.toUpperCase() === "USD" ? "usd" : code.toUpperCase() === "BDT" ? "bdt" : null;
    if (!key || !entry || typeof entry !== "object") continue;
    for (const cycle of CYCLE_KEYS) {
      const raw = (entry as Record<string, unknown>)[cycle];
      if (typeof raw !== "string" || raw.trim() === "") continue;
      const n = Number(raw);
      if (!Number.isFinite(n) || n < 0) continue;
      prices[key][cycle] = n;
      cycles.add(cycle);
    }
  }
  return { prices, cycles: [...cycles] };
}

/**
 * Best-effort mapping of WHMCS GetProducts output to our plan model.
 * WHMCS product structure varies by version, so this is defensive.
 * Returns null on parse failure; an empty array means "no products yet".
 */
function mapWhmcsProducts(raw: Record<string, unknown>): HostingPlan[] | null {
  const products = raw.products;
  let items: unknown[] | null = null;
  if (Array.isArray(products)) {
    items = products;
  } else if (products && typeof products === "object") {
    const arr = (products as { product?: unknown }).product;
    if (Array.isArray(arr)) items = arr;
  }

  if (!items) {
    const total = raw.totalresults;
    if (total === "0" || total === 0) return [];
    return null;
  }

  const plans: HostingPlan[] = [];
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const p = item as Record<string, unknown>;
    const pid = typeof p.pid === "string" ? p.pid : String(p.pid ?? "");
    if (!pid) continue;

    const name = typeof p.name === "string" && p.name.trim() ? p.name.trim() : `Plan ${pid}`;
    const specLines = descriptionLines(p.description);
    const { prices, cycles } = currencyPricing(p.pricing);

    if (cycles.length === 0) {
      log("WHMCS_RESPONSE", { note: `Product "${name}" (pid ${pid}) has no enabled billing cycle; hidden until a price is set.` });
      continue;
    }

    plans.push({
      id: `whmcs-${pid}`,
      category: categoryForProduct(p),
      name,
      tagline: specLines[0] ?? "",
      whmcsPid: Number(pid),
      billingCycles: cycles,
      prices,
      features: specLines,
      resourceSpecs: [],
    });
  }

  return plans;
}

/**
 * Merge catalog-only marketing fields by whmcsPid — but only when the
 * WHMCS product has no spec list of its own, so WHMCS specs are never
 * replaced by stale catalog data.
 */
function mergeCatalogExtras(plans: HostingPlan[]): HostingPlan[] {
  const catalogByPid = new Map<number, HostingPlan>();
  for (const plan of loadPlans()) {
    if (plan.whmcsPid !== undefined) catalogByPid.set(plan.whmcsPid, plan);
  }

  return plans.map((plan) => {
    const local = plan.whmcsPid !== undefined ? catalogByPid.get(plan.whmcsPid) : undefined;
    if (!local) return plan;

    if (plan.features.length < 2) {
      return {
        ...plan,
        tagline: local.tagline || plan.tagline,
        features: local.features,
        resourceSpecs: local.resourceSpecs,
        popular: local.popular,
        badge: local.badge,
        customOrderUrl: local.customOrderUrl,
      };
    }
    return { ...plan, customOrderUrl: local.customOrderUrl };
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