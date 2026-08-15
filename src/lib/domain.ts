import { loadTlds } from "@/lib/site-config";
import { getEnv } from "@/lib/env";
import { log } from "@/lib/logger";
import { whmcsRequest } from "@/lib/whmcs";
import type { TldConfig } from "@/lib/site-types";

/**
 * Domain availability + TLD pricing provider.
 *
 * TLD list and prices are WHMCS-first: when WHMCS is configured
 * (USE_WHMCS_PRODUCTS=true and credentials present), GetTLDPricing is
 * the source of truth for register/renew/transfer fees per currency.
 * WHMCS pricing is cached for WHMCS_CACHE_TTL_MS; when the API is
 * unreachable or no TLDs are priced yet, the local catalog is served
 * as a graceful fallback.
 *
 * Availability is checked live through WHMCS DomainWhois when WHMCS is
 * reachable, with a deterministic mock as fallback.
 */

export interface DomainCheckResult {
  domain: string;
  tld: string;
  available: boolean;
  premium?: boolean;
  registerBdt?: number;
  registerUsd?: number;
  renewBdt?: number;
  renewUsd?: number;
  transferBdt?: number;
  transferUsd?: number;
  source: "mock" | "registrar";
}

export interface RegistrarProvider {
  name: string;
  check(domain: string, tlds: TldConfig[]): Promise<DomainCheckResult[]>;
}

function isValidDomain(name: string): boolean {
  return /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i.test(name) && name.length >= 2;
}

/** Deterministic pseudo-availability so the demo behaves consistently. */
function mockAvailable(domain: string, tld: string): boolean {
  let h = 0;
  const s = `${domain}${tld}`;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 10 !== 0; // ~90% "available" in mock mode
}

export async function checkDomain(
  query: string,
  opts: { tlds?: string[] } = {},
): Promise<{ results: DomainCheckResult[]; source: "mock" | "registrar"; tldSource: TldSource }> {
  const cleaned = query.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "");
  const { tlds: allTlds, source: tldSource } = await fetchTlds();

  const { name, explicitTld } = splitDomain(cleaned, allTlds);
  if (!isValidDomain(name)) {
    return { results: [], source: "mock", tldSource };
  }

  const selected = (opts.tlds?.length ? opts.tlds : [explicitTld ?? null]).filter(
    (t): t is string => Boolean(t),
  );
  const tldConfigs =
    selected.length > 0
      ? allTlds.filter((t) => selected.includes(t.tld.replace(/^\./, "")))
      : allTlds.slice(0, 10);

  log("DOMAIN_SEARCH", { domain: name, tlds: tldConfigs.length });

  const live = await checkWhmcsWhois(name, tldConfigs);
  if (live) {
    return { results: live, source: "registrar", tldSource };
  }

  const results: DomainCheckResult[] = tldConfigs.map((tld) => {
    const available = mockAvailable(name, tld.tld);
    return {
      domain: name,
      tld: tld.tld,
      available,
      premium: tld.premium,
      registerBdt: tld.registerBdt,
      registerUsd: tld.registerUsd,
      renewBdt: tld.renewBdt,
      renewUsd: tld.renewUsd,
      transferBdt: tld.transferBdt,
      transferUsd: tld.transferUsd,
      source: "mock",
    };
  });

  return { results, source: "mock", tldSource };
}

/** Splits "google.com" into { name: "google", explicitTld: "com" }. */
function splitDomain(input: string, tlds: TldConfig[]): { name: string; explicitTld: string | null } {
  const tldList = tlds
    .map((t) => t.tld.replace(/^\./, ""))
    .sort((a, b) => b.length - a.length);
  for (const tld of tldList) {
    const suffix = `.${tld}`;
    if (input.endsWith(suffix)) {
      return { name: input.slice(0, -suffix.length), explicitTld: tld };
    }
  }
  return { name: input, explicitTld: null };
}

/** Live availability via the WHMCS DomainWhois API. Null on failure → mock fallback. */
async function checkWhmcsWhois(
  name: string,
  tldConfigs: TldConfig[],
): Promise<DomainCheckResult[] | null> {
  if (!getEnv().whmcsConfigured) return null;
  const { whmcsApiUrl, whmcsIdentifier, whmcsSecret, whmcsTimeoutMs } = getEnv();
  if (!whmcsApiUrl || !whmcsIdentifier || !whmcsSecret) return null;

  try {
    const results = await Promise.all(
      tldConfigs.map(async (tld): Promise<DomainCheckResult> => {
        try {
          const res = await fetch(whmcsApiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              identifier: whmcsIdentifier,
              secret: whmcsSecret,
              action: "DomainWhois",
              domain: `${name}.${tld.tld.replace(/^\./, "")}`,
              responsetype: "json",
            }),
            signal: AbortSignal.timeout(whmcsTimeoutMs),
          });
          const data = (await res.json()) as {
            result?: string;
            status?: string;
          };
          if (data.result === "success" && data.status !== "error") {
            return {
              domain: name,
              tld: tld.tld,
              available: data.status === "available",
              premium: tld.premium,
              registerBdt: tld.registerBdt,
              registerUsd: tld.registerUsd,
              renewBdt: tld.renewBdt,
              renewUsd: tld.renewUsd,
              transferBdt: tld.transferBdt,
              transferUsd: tld.transferUsd,
              source: "registrar",
            };
          }
        } catch {
          // whois failed for this TLD (unsupported / timeout) → fall back
        }
        return {
          domain: name,
          tld: tld.tld,
          available: mockAvailable(name, tld.tld),
          premium: tld.premium,
          registerBdt: tld.registerBdt,
          registerUsd: tld.registerUsd,
          renewBdt: tld.renewBdt,
          renewUsd: tld.renewUsd,
          transferBdt: tld.transferBdt,
          transferUsd: tld.transferUsd,
          source: "mock",
        };
      }),
    );
    return results;
  } catch (err) {
    log("WHMCS_ERROR", {
      action: "DomainWhois",
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

/**
 * Registrar provider registry. Implement a provider and register it
 * here to enable live availability checks. Example contract:
 */

/* ------------------------- TLD pricing sync (WHMCS) ------------------------ */

export type TldSource = "whmcs" | "catalog" | "unavailable";

export interface TldFetchResult {
  tlds: TldConfig[];
  source: TldSource;
  fetchedAt?: number;
}

type TldPrices = {
  register?: number;
  renew?: number;
  transfer?: number;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function toPositiveNumber(v: unknown): number | undefined {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

/**
 * WHMCS 8.12+ returns each price nested by period, e.g. { "1": "16.99" }
 * (1-year). Some builds return a flat number. This resolves the price for
 * the shortest (1-year) period, falling back to a flat numeric value.
 */
function resolvePrice(v: unknown): number | undefined {
  if (typeof v === "number" || typeof v === "string") return toPositiveNumber(v);
  if (isRecord(v)) {
    for (const period of ["1", "12"]) {
      const n = toPositiveNumber(v[period]);
      if (n !== undefined) return n;
    }
    const any = Object.values(v).find((x) => x !== undefined);
    return toPositiveNumber(any);
  }
  return undefined;
}

/**
 * Parse a GetTLDPricing response into { "<tld>": prices }. WHMCS returns
 * an object keyed by TLD (each with register/renew/transfer), with prices
 * nested per period; some builds nest per-currency objects instead. Null
 * when nothing is priced.
 */
function parseTldPrices(raw: Record<string, unknown>): Record<string, TldPrices> | null {
  const pricing = raw.pricing;
  if (!isRecord(pricing)) return null;

  let tldMap: Record<string, unknown> = pricing;
  const nested = Object.entries(pricing).find(
    ([code, value]) => /^[A-Z]{3}$/.test(code) && isRecord(value),
  );
  if (nested) tldMap = nested[1] as Record<string, unknown>;

  const out: Record<string, TldPrices> = {};
  for (const [tld, value] of Object.entries(tldMap)) {
    const dotted = tld.startsWith(".") ? tld : `.${tld}`;
    if (!isRecord(value)) continue;
    const prices = {
      register: resolvePrice(value.register),
      renew: resolvePrice(value.renew),
      transfer: resolvePrice(value.transfer),
    };
    if (prices.register !== undefined || prices.renew !== undefined || prices.transfer !== undefined) {
      out[dotted] = prices;
    }
  }
  return Object.keys(out).length > 0 ? out : null;
}

/**
 * Fetch register/renew/transfer prices for every enabled TLD, per
 * currency (GetCurrencies → GetTLDPricing per currency id). Null when
 * WHMCS reports no TLD pricing at all.
 */
async function fetchWhmcsTldPricing(): Promise<Record<string, Partial<TldConfig>> | null> {
  const currencies = await whmcsRequest("GetCurrencies", {});
  if (!currencies.ok) return null;

  let rawList: unknown[] | null = null;
  if (isRecord(currencies.data.currencies)) {
    const arr = (currencies.data.currencies as { currency?: unknown }).currency;
    if (Array.isArray(arr)) rawList = arr;
  } else if (Array.isArray(currencies.data.currencies)) {
    rawList = currencies.data.currencies;
  }
  if (!rawList) return null;

  const merged: Record<string, Partial<TldConfig>> = {};
  let found = false;

  for (const entry of rawList) {
    if (!isRecord(entry)) continue;
    const key = String(entry.code ?? "").toUpperCase();
    const field = key === "USD" ? ("usd" as const) : key === "BDT" ? ("bdt" as const) : null;
    const id = Number(entry.id);
    if (!field || !Number.isFinite(id)) continue;

    const res = await whmcsRequest("GetTLDPricing", { currencyid: id });
    if (!res.ok) continue;
    const parsed = parseTldPrices(res.data);
    if (!parsed) continue;
    found = true;

    for (const [tld, prices] of Object.entries(parsed)) {
      const target = (merged[tld] ??= { tld });
      if (prices.register !== undefined) {
        if (field === "usd") target.registerUsd = prices.register;
        else target.registerBdt = prices.register;
      }
      if (prices.renew !== undefined) {
        if (field === "usd") target.renewUsd = prices.renew;
        else target.renewBdt = prices.renew;
      }
      if (prices.transfer !== undefined) {
        if (field === "usd") target.transferUsd = prices.transfer;
        else target.transferBdt = prices.transfer;
      }
    }
  }

  return found ? merged : null;
}

/**
 * Merge WHMCS TLD prices with local catalog extras (premium flag,
 * min years, prices for a currency WHMCS did not return).
 */
function mergeTldExtras(pricing: Record<string, Partial<TldConfig>>): TldConfig[] {
  const localByTld = new Map(loadTlds().map((t) => [t.tld, t]));
  const out: TldConfig[] = [];

  for (const [tld, prices] of Object.entries(pricing)) {
    const local = localByTld.get(tld);
    const registerBdt = prices.registerBdt ?? local?.registerBdt;
    const registerUsd = prices.registerUsd ?? local?.registerUsd;
    if (registerBdt === undefined && registerUsd === undefined) continue;

    out.push({
      tld,
      registerBdt: registerBdt ?? 0,
      registerUsd: registerUsd ?? 0,
      renewBdt: prices.renewBdt ?? local?.renewBdt ?? 0,
      renewUsd: prices.renewUsd ?? local?.renewUsd ?? 0,
      transferBdt: prices.transferBdt ?? local?.transferBdt ?? 0,
      transferUsd: prices.transferUsd ?? local?.transferUsd ?? 0,
      premium: prices.premium ?? local?.premium,
      minYears: prices.minYears ?? local?.minYears ?? 1,
    });
  }

  return out;
}

let tldCache: { key: string; result: TldFetchResult; at: number } | null = null;

function tldCacheKey(): string {
  const env = getEnv();
  return [env.whmcsApiUrl, env.whmcsIdentifier, env.whmcsSecret].join("|");
}

/**
 * Fetch TLD list + pricing: WHMCS first (when enabled), local catalog
 * as fallback. WHMCS with zero priced TLDs (not yet configured there)
 * also falls back to the catalog so the domains page keeps working.
 */
export async function fetchTlds(): Promise<TldFetchResult> {
  const env = getEnv();
  const key = tldCacheKey();

  if (tldCache && tldCache.key === key && Date.now() - tldCache.at < env.whmcsCacheTtlMs) {
    return tldCache.result;
  }

  let result: TldFetchResult;
  if (env.useWhmcsProducts && env.whmcsApiUrl && env.whmcsIdentifier && env.whmcsSecret) {
    const pricing = await fetchWhmcsTldPricing();
    if (pricing && Object.keys(pricing).length > 0) {
      result = { tlds: mergeTldExtras(pricing), source: "whmcs", fetchedAt: Date.now() };
    } else {
      log("WHMCS_RESPONSE", {
        note: "GetTLDPricing returned no configured TLDs; using local catalog.",
      });
      result = { tlds: loadTlds(), source: "unavailable" };
    }
  } else {
    result = { tlds: loadTlds(), source: "catalog" };
  }

  tldCache = { key, result, at: Date.now() };
  return result;
}
