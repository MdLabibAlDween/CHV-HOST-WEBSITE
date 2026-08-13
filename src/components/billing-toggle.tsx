"use client";

import type { BillingCycle } from "@/lib/site-types";

const SHORT_LABELS: Record<BillingCycle, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  semiannually: "Semi-Annually",
  annually: "Yearly",
  biennially: "2 Years",
  triennially: "3 Years",
};

export function BillingToggle({
  cycles,
  value,
  onChange,
}: {
  cycles: BillingCycle[];
  value: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
}) {
  if (cycles.length <= 1) return null;

  return (
    <div
      className="inline-flex max-w-full flex-wrap justify-center rounded-xl border border-border-soft bg-white p-1 dark:border-white/10 dark:bg-ink"
      role="group"
      aria-label="Select billing period"
    >
      {cycles.map((cycle) => (
        <button
          key={cycle}
          type="button"
          aria-pressed={value === cycle}
          onClick={() => onChange(cycle)}
          className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${
            value === cycle ? "btn-gradient text-white" : "text-muted hover:text-primary"
          }`}
        >
          {SHORT_LABELS[cycle]}
        </button>
      ))}
    </div>
  );
}
