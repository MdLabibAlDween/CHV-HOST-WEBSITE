"use client";

import { useMemo, useState } from "react";
import type { HostingPlan, BillingCycle, CurrencyCode, PlanCategory } from "@/lib/site-types";
import { CATEGORY_META } from "@/lib/site-types";
import { PricingCard } from "@/components/pricing-card";
import { BillingToggle } from "@/components/billing-toggle";
import { CurrencyToggle } from "@/components/currency-toggle";
import { useCurrency } from "@/components/currency-provider";
import { priceKey, availableCurrencies } from "@/lib/format";
import { Icon } from "@/components/icons";

/**
 * Client pricing section: category + billing-cycle + currency toggles
 * around server-fetched plan data.
 */
export function PricingSection({
  plans,
  whmcsUrl = "",
  categories,
}: {
  plans: HostingPlan[];
  whmcsUrl?: string;
  categories?: PlanCategory[];
}) {
  const { currency } = useCurrency();
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [activeCategory, setActiveCategory] = useState<PlanCategory | null>(null);

  const categoryTabs = useMemo(() => {
    if (!categories || categories.length === 0) return null;
    const defaultTab = categories.find((c) => plans.some((p) => p.category === c)) ?? categories[0];
    const active = activeCategory && categories.includes(activeCategory) ? activeCategory : defaultTab;
    return { tabs: categories, active };
  }, [categories, plans, activeCategory]);

  const categoryPlans = useMemo(() => {
    if (!categoryTabs) return plans;
    return plans.filter((p) => p.category === categoryTabs.active);
  }, [plans, categoryTabs]);

  const currencies = useMemo(() => availableCurrencies(categoryPlans), [categoryPlans]);
  const effectiveCurrency = (currencies.includes(currency) ? currency : currencies[0] ?? "BDT") as CurrencyCode;

  const availableCycles = useMemo(() => {
    const set = new Set<BillingCycle>();
    for (const plan of categoryPlans) {
      for (const c of plan.billingCycles) {
        if (plan.prices[priceKey(effectiveCurrency)][c] !== undefined) set.add(c);
      }
    }
    const order: BillingCycle[] = ["monthly", "quarterly", "semiannually", "annually", "biennially", "triennially"];
    return order.filter((c) => set.has(c));
  }, [categoryPlans, effectiveCurrency]);

  const effectiveCycle = availableCycles.includes(cycle) ? cycle : availableCycles[0] ?? "monthly";

  return (
    <div>
      {categoryTabs && (
        <div
          className="mb-8 flex flex-wrap justify-center gap-2"
          role="group"
          aria-label="Select plan category"
        >
          {categoryTabs.tabs.map((category) => {
            const isActive = category === categoryTabs.active;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "btn-gradient border-transparent text-white"
                    : "border-border-soft bg-card text-muted hover:border-primary/40 hover:text-primary dark:border-white/10"
                }`}
              >
                {CATEGORY_META[category]?.label ?? category}
              </button>
            );
          })}
        </div>
      )}

      {categoryPlans.length === 0 ? (
        <div className="mx-auto max-w-md rounded-3xl border border-border-soft bg-card p-10 text-center shadow-sm dark:border-white/10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon name="bolt" size={28} />
          </div>
          <h2 className="mt-5 text-xl font-extrabold text-slate-900 dark:text-slate-100">Plans coming soon</h2>
          <p className="mt-2 text-sm text-muted">
            We are finalizing the plans for this category. New offers will appear here automatically once they are available.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CurrencyToggle currencies={currencies} />
            <BillingToggle
              cycles={availableCycles}
              value={effectiveCycle}
              onChange={setCycle}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {categoryPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} cycle={effectiveCycle} currency={effectiveCurrency} whmcsUrl={whmcsUrl} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
