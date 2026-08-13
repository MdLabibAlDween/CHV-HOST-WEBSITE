"use client";

import { useMemo, useState } from "react";
import type { HostingPlan, BillingCycle, CurrencyCode } from "@/lib/site-types";
import { PricingCard } from "@/components/pricing-card";
import { ComparisonTable } from "@/components/comparison-table";
import { BillingToggle } from "@/components/billing-toggle";
import { CurrencyToggle } from "@/components/currency-toggle";
import { useCurrency } from "@/components/currency-provider";
import { priceKey, availableCurrencies } from "@/lib/format";
import { Icon } from "@/components/icons";

/** Plans + comparison table with billing-cycle and currency toggles. */
export function CategoryPricing({
  plans,
  compare = true,
}: {
  plans: HostingPlan[];
  compare?: boolean;
}) {
  const { currency } = useCurrency();
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  const currencies = useMemo(() => availableCurrencies(plans), [plans]);
  const effectiveCurrency = (currencies.includes(currency) ? currency : currencies[0] ?? "BDT") as CurrencyCode;

  const availableCycles = useMemo(() => {
    const set = new Set<BillingCycle>();
    for (const plan of plans) {
      for (const c of plan.billingCycles) {
        if (plan.prices[priceKey(effectiveCurrency)][c] !== undefined) set.add(c);
      }
    }
    const order: BillingCycle[] = ["monthly", "quarterly", "semiannually", "annually", "biennially", "triennially"];
    return order.filter((c) => set.has(c));
  }, [plans, effectiveCurrency]);

  const effectiveCycle = availableCycles.includes(cycle) ? cycle : (availableCycles[0] ?? "monthly");

  if (plans.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-border-soft bg-card p-10 text-center shadow-sm dark:border-white/10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon name="bolt" size={28} />
        </div>
        <h2 className="mt-5 text-xl font-extrabold text-slate-900 dark:text-slate-100">Plans coming soon</h2>
        <p className="mt-2 text-sm text-muted">
          We are finalizing the plans for this category. New offers will appear here automatically once they are available.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <CurrencyToggle currencies={currencies} />
        <BillingToggle cycles={availableCycles} value={effectiveCycle} onChange={setCycle} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} cycle={effectiveCycle} currency={effectiveCurrency} />
        ))}
      </div>

      {compare && plans.length > 1 && (
        <div className="mt-16">
          <h2 className="text-center text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-slate-100">
            Compare plans
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted sm:text-base">
            Every plan includes cPanel, LiteSpeed, free SSL, daily backups and 24/7 support.
          </p>
          <div className="mt-8">
            <ComparisonTable plans={plans} cycle={effectiveCycle} currency={effectiveCurrency} />
          </div>
        </div>
      )}
    </div>
  );
}