"use client";

import { useState } from "react";
import type { HostingPlan } from "@/lib/site-types";
import { CategoryPricing } from "@/components/category-pricing";

interface CategoryTab {
  id: string;
  label: string;
  plans: HostingPlan[];
}

/** Client tabbed pricing view across hosting categories. */
export function PricingTabs({ categories }: { categories: CategoryTab[] }) {
  const [active, setActive] = useState(categories[0]?.id ?? "");
  const current = categories.find((c) => c.id === active) ?? categories[0];

  if (!current) return null;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Hosting categories"
        className="mb-10 flex flex-wrap justify-center gap-2"
      >
        {categories.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
              active === tab.id
                ? "btn-gradient text-white"
                : "border border-border-soft bg-white text-slate-600 hover:border-primary/40 hover:text-primary dark:border-white/10 dark:bg-ink dark:text-slate-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" aria-label={current.label}>
        <CategoryPricing plans={current.plans} />
      </div>
    </div>
  );
}
