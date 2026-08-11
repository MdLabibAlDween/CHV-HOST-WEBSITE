import { loadTlds } from "@/lib/site-config";
import { getEnv } from "@/lib/env";
import { log } from "@/lib/logger";
import type { TldConfig } from "@/lib/site-types";

/**
 * Domain availability provider.
 *
 * Currently runs in "mock" mode: availability is determined by a
 * deterministic hash so results are stable, and prices come from the
 * configurable TLD list. The `RegistrarProvider` interface is ready
 * for a real registrar (ResellerClub, Namecheap, Netim, OpenSRS, ...);
 * wire your registrar client into `checkDomain` when credentials exist.
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
): Promise<{ results: DomainCheckResult[]; source: "mock" | "registrar" }> {
  const cleaned = query.trim().toLowerCase();
  const env = getEnv();

  if (!isValidDomain(cleaned)) {
    return { results: [], source: "mock" };
  }

  const allTlds = loadTlds();
  const selected = opts.tlds?.length
    ? allTlds.filter((t) => opts.tlds!.includes(t.tld))
    : allTlds.slice(0, 10);

  const requested = (opts.tlds ?? []).length > 0 ? selected : selected;

  log("DOMAIN_SEARCH", { domain: cleaned, tlds: requested.length });

  // Registrar hook: when DOMAIN_REGISTRAR is configured, call the
  // registered provider here and return its results. Example stub
  // below demonstrates the contract.
  if (env.domainRegistrar) {
    const provider = registrarProviders[env.domainRegistrar.toLowerCase()];
    if (provider) {
      try {
        const results = await provider.check(cleaned, requested);
        return { results, source: "registrar" };
      } catch {
        // fall through to mock on registrar failure (retry shown in UI)
      }
    }
  }

  const results: DomainCheckResult[] = requested.map((tld) => {
    const available = mockAvailable(cleaned, tld.tld);
    return {
      domain: cleaned,
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

  return { results, source: "mock" };
}

/**
 * Registrar provider registry. Implement a provider and register it
 * here to enable live availability checks. Example contract:
 */
const registrarProviders: Record<string, RegistrarProvider> = {
  // example: async check(domain, tlds) { ... call registrar API ... }
  // "resellerclub": resellerclubProvider,
};

/** Configurable TLD list for the domain page. */
export function getTlds(): TldConfig[] {
  return loadTlds();
}
