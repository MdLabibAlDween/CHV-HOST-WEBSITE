"use client";

import { useCurrency } from "@/components/currency-provider";
import type { CurrencyCode } from "@/lib/site-types";

export function CurrencyToggle({ currencies }: { currencies: CurrencyCode[] }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div
      className="inline-flex rounded-xl border border-border-soft bg-white p-1 dark:border-white/10 dark:bg-ink"
      role="group"
      aria-label="Select currency"
    >
      {currencies.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={currency === option}
          onClick={() => setCurrency(option)}
          className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${
            currency === option
              ? "btn-gradient text-white"
              : "text-muted hover:text-primary"
          }`}
        >
          {option === "BDT" ? "৳ BDT" : "$ USD"}
        </button>
      ))}
    </div>
  );
}