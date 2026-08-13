"use client";

import { useCallback, useState } from "react";
import { Icon } from "@/components/icons";
import { useCurrency } from "@/components/currency-provider";
import { formatMoney } from "@/lib/format";
import { useEnv } from "@/lib/public-env";

interface DomainResult {
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

interface CartItem {
  domain: string;
  tld: string;
  registerPrice: number;
  currency: "BDT" | "USD";
  years: number;
}

const POPULAR_TLDS = [".com", ".net", ".org", ".xyz", ".info", ".online", ".bd", ".com.bd"];

export function DomainSearch({ compact = false }: { compact?: boolean }) {
  const { currency } = useCurrency();
  const env = useEnv();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DomainResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [added, setAdded] = useState<string[]>([]);

  const search = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      const q = query.trim().replace(/^https?:\/\//, "").replace(/^www\./, "");
      if (!q) return;
      setLoading(true);
      setError(null);
      setResults(null);
      setSearched(q);
      try {
        const res = await fetch(`/api/domains/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Search failed");
        setResults(data.results);
      } catch {
        setError("We couldn't reach the domain service. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [query],
  );

  const addToCart = (result: DomainResult) => {
    const registerPrice = currency === "BDT" ? result.registerBdt ?? 0 : result.registerUsd ?? 0;
    const key = `${result.domain}${result.tld}`;
    if (cart.some((c) => `${c.domain}${c.tld}` === key)) return;
    setCart((prev) => [
      ...prev,
      { domain: result.domain, tld: result.tld, registerPrice, currency, years: 1 },
    ]);
    setAdded((prev) => [...prev, key]);
  };

  const checkoutUrl = env.whmcsUrl
    ? `${env.whmcsUrl.replace(/\/$/, "")}/cart.php?a=add&domain=${encodeURIComponent(
        cart[0]?.domain ?? searched,
      )}${cart[0]?.tld ?? ""}`
    : `/checkout?domain=${encodeURIComponent(searched)}`;

  return (
    <div className="w-full">
      <form onSubmit={search} role="search" className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="domain-search-input" className="sr-only">
          Search for a domain
        </label>
        <div className="relative flex-1">
          <Icon
            name="search"
            size={20}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            id="domain-search-input"
            type="text"
            inputMode="url"
            autoComplete="off"
            placeholder="yourdomain.com"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-14 w-full rounded-xl border border-border-soft bg-card pl-12 pr-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="btn-gradient inline-flex h-14 items-center justify-center gap-2 rounded-xl px-8 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Checking…
            </>
          ) : (
            <>
              <Icon name="search" size={18} />
              Search
            </>
          )}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-semibold">Popular:</span>
        {POPULAR_TLDS.map((tld) => (
          <button
            key={tld}
            type="button"
            onClick={() => setQuery((q) => q.split(".")[0] + tld)}
            className="rounded-full border border-border-soft bg-card px-3 py-2 text-xs font-medium transition-colors hover:border-primary/40 hover:text-primary dark:border-white/10"
          >
            {tld}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <p className="flex items-center gap-2">
            <Icon name="warning" size={16} />
            {error}
          </p>
          <button
            type="button"
            onClick={search}
            className="mt-2 inline-flex items-center gap-1.5 font-semibold text-rose-700 underline underline-offset-2 hover:text-rose-800"
          >
            <Icon name="refresh" size={14} />
            Try again
          </button>
        </div>
      )}

      {results && results.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border-soft bg-card dark:border-white/10">
          <div className="border-b border-border-soft bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            Results for <span className="text-primary">{searched}</span>
          </div>
          <ul className="divide-y divide-border-soft">
            {results.map((result) => {
              const key = `${result.domain}${result.tld}`;
              const isAdded = added.includes(key);
              const price = currency === "BDT" ? result.registerBdt : result.registerUsd;
              return (
                <li key={key} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {result.domain}
                      <span className="text-primary">{result.tld}</span>
                      {result.premium && (
                        <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                          Premium
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {result.available ? (
                        <>
                          Register {formatMoney(price ?? 0, currency)}/yr · Renew{" "}
                          {formatMoney(currency === "BDT" ? result.renewBdt ?? 0 : result.renewUsd ?? 0, currency)}
                          /yr
                        </>
                      ) : (
                        "Not available for registration"
                      )}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                        result.available
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {result.available ? (
                        <>
                          <Icon name="check-circle" size={14} /> Available
                        </>
                      ) : (
                        <>
                          <Icon name="x" size={14} /> Taken
                        </>
                      )}
                    </span>
                    {result.available && (
                      <button
                        type="button"
                        disabled={isAdded}
                        onClick={() => addToCart(result)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-colors ${
                          isAdded
                            ? "cursor-default bg-emerald-50 text-emerald-700"
                            : "btn-gradient text-white hover:brightness-110"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Icon name="check" size={14} /> Added
                          </>
                        ) : (
                          <>
                            <Icon name="cart" size={14} /> Add to Cart
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {cart.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-border-soft bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-white/5">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <span className="font-bold">{cart.length}</span> domain{cart.length > 1 ? "s" : ""} in
                cart · Total{" "}
                <span className="font-bold">
                  {formatMoney(
                    cart.reduce((sum, c) => sum + c.registerPrice, 0),
                    currency,
                  )}
                </span>
              </p>
              <a
                href={checkoutUrl}
                className="btn-gradient inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold"
              >
                Continue to Checkout
                <Icon name="arrow-right" size={16} />
              </a>
            </div>
          )}
        </div>
      )}

      {!compact && results && results.length === 0 && !loading && !error && (
        <p className="mt-5 text-center text-sm text-muted">
          No results. Please check the domain name and try again.
        </p>
      )}
    </div>
  );
}
