"use client";

import { useMemo, useState } from "react";
import type { HostingPlan, BillingCycle } from "@/lib/site-types";
import { PricingCard } from "@/components/pricing-card";
import { BillingToggle } from "@/components/billing-toggle";
import { CurrencyToggle } from "@/components/currency-toggle";
import { useCurrency } from "@/components/currency-provider";
import { priceKey } from "@/lib/format";

/**
 * Client pricing section: billing-cycle + currency toggles around
 * server-fetched plan data.
 */
export function PricingSection({ plans }: { plans: HostingPlan[] }) {
  const { currency } = useCurrency();
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  const availableCycles = useMemo(() => {
    const set = new Set<BillingCycle>();
    for (const plan of plans) {
      for (const c of plan.billingCycles) {
        if (plan.prices[priceKey(currency)][c] !== undefined) set.add(c);
      }
    }
    const order: BillingCycle[] = ["monthly", "quarterly", "semiannually", "annually", "biennially", "triennially"];
    return order.filter((c) => set.has(c));
  }, [plans, currency]);

  const effectiveCycle = availableCycles.includes(cycle) ? cycle : availableCycles[0] ?? "monthly";

  return (
    <div>
      <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <CurrencyToggle />
        <BillingToggle
          cycles={availableCycles}
          value={effectiveCycle}
          onChange={setCycle}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} cycle={effectiveCycle} currency={currency} />
        ))}
      </div>
    </div>
  );
}
