import type { BillingCycle, CurrencyCode } from "@/lib/site-types";

/** WHMCS-style billing cycle keys. */
export const BILLING_CYCLES: BillingCycle[] = [
  "monthly",
  "quarterly",
  "semiannually",
  "annually",
  "biennially",
  "triennially",
];

const BDT_SYMBOL = "৳";
const USD_SYMBOL = "$";

/** Format a numeric amount in the selected currency. */
export function formatMoney(amount: number, currency: CurrencyCode): string {
  const n = Number(amount);
  if (currency === "USD") {
    return `${USD_SYMBOL}${n.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 0 })}`;
  }
  return `${BDT_SYMBOL}${n.toLocaleString("en-BD", { maximumFractionDigits: 0 })}`;
}

export function formatMoneyFull(amount: number, currency: CurrencyCode): string {
  const n = Number(amount);
  if (currency === "USD") {
    return `${USD_SYMBOL}${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `${BDT_SYMBOL}${n.toLocaleString("en-BD")}`;
}

/** Human label for a billing cycle. */
export function cycleLabel(cycle: BillingCycle): string {
  const labels: Record<BillingCycle, string> = {
    monthly: "mo",
    quarterly: "quarter",
    semiannually: "6 mo",
    annually: "yr",
    biennially: "2 yr",
    triennially: "3 yr",
  };
  return labels[cycle] ?? cycle;
}

/** Long label, e.g. "per month". */
export function cyclePerLabel(cycle: BillingCycle): string {
  const labels: Record<BillingCycle, string> = {
    monthly: "per month",
    quarterly: "per quarter",
    semiannually: "per 6 months",
    annually: "per year",
    biennially: "per 2 years",
    triennially: "per 3 years",
  };
  return labels[cycle] ?? cycle;
}

/** Index key for a plan's PriceEntry (lowercase currency code). */
export function priceKey(currency: CurrencyCode): "bdt" | "usd" {
  return currency === "USD" ? "usd" : "bdt";
}

/** The set of billing cycles that have a price for a plan in a currency. */
export function availableCycles(
  cycles: BillingCycle[],
  prices: { bdt: Partial<Record<BillingCycle, number>>; usd: Partial<Record<BillingCycle, number>> },
  currency: CurrencyCode,
): BillingCycle[] {
  return cycles.filter((c) => prices[priceKey(currency)][c] !== undefined);
}

/** Number of months covered by a billing cycle. */
export function cycleMonths(cycle: BillingCycle): number {
  const months: Record<BillingCycle, number> = {
    monthly: 1,
    quarterly: 3,
    semiannually: 6,
    annually: 12,
    biennially: 24,
    triennially: 36,
  };
  return months[cycle] ?? 1;
}

/** Effective monthly price for a cycle (used for "save X%" hints). */
export function effectiveMonthly(amount: number, cycle: BillingCycle): number {
  return amount / cycleMonths(cycle);
}
