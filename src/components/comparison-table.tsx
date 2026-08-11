import type { HostingPlan, BillingCycle, CurrencyCode } from "@/lib/site-types";
import { formatMoney, priceKey } from "@/lib/format";
import { Icon } from "@/components/icons";
import { orderHref } from "@/lib/order";

/**
 * Responsive feature comparison: table on large screens, stacked cards
 * on mobile (per PRD §42 — no horizontal overflow).
 */
export function ComparisonTable({
  plans,
  cycle,
  currency,
}: {
  plans: HostingPlan[];
  cycle: BillingCycle;
  currency: CurrencyCode;
}) {
  const allSpecs = Array.from(new Map(plans.flatMap((p) => p.resourceSpecs.map((s) => [s.label, s.label]))).values());

  const rowValue = (plan: HostingPlan, label: string) =>
    plan.resourceSpecs.find((s) => s.label === label)?.value ?? "—";

  return (
    <div>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border-soft bg-white shadow-sm lg:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border-soft bg-slate-50">
              <th scope="col" className="px-5 py-4 text-left font-semibold text-slate-700">
                Features
              </th>
              {plans.map((plan) => (
                <th key={plan.id} scope="col" className="px-5 py-4 text-left font-bold text-slate-900">
                  <span className="flex items-center gap-2">
                    {plan.name}
                    {plan.popular && (
                      <span className="rounded-full btn-gradient px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        Popular
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border-soft">
              <th scope="row" className="bg-slate-50/50 px-5 py-3 text-left font-semibold text-slate-700">
                Price ({currency})
              </th>
              {plans.map((plan) => {
                const price = plan.prices[priceKey(currency)][cycle];
                return (
                  <td key={plan.id} className="px-5 py-3 font-bold text-primary">
                    {price !== undefined ? `${formatMoney(price, currency)}/${cycle}` : "Contact us"}
                  </td>
                );
              })}
            </tr>
            {allSpecs.map((label) => (
              <tr key={label} className="border-b border-border-soft last:border-0">
                <th scope="row" className="bg-slate-50/50 px-5 py-3 text-left font-medium text-slate-600">
                  {label}
                </th>
                {plans.map((plan) => (
                  <td key={plan.id} className="px-5 py-3 text-slate-700">
                    {rowValue(plan, label)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row" className="bg-slate-50/50 px-5 py-4" />
              {plans.map((plan) => (
                <td key={plan.id} className="px-5 py-4">
                  <a
                    href={orderHref(plan, cycle)}
                    className={`inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-bold ${
                      plan.popular ? "btn-gradient" : "border border-primary/30 text-primary hover:bg-primary hover:text-white"
                    }`}
                  >
                    Order Now
                    <Icon name="arrow-right" size={14} />
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="space-y-6 lg:hidden">
        {plans.map((plan) => {
          const price = plan.prices[priceKey(currency)][cycle];
          return (
            <div
              key={plan.id}
              className={`rounded-2xl border bg-white p-5 shadow-sm ${
                plan.popular ? "border-primary/50 ring-1 ring-primary/20" : "border-border-soft"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">{plan.name}</h3>
                {plan.popular && (
                  <span className="rounded-full btn-gradient px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Popular
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-primary">
                {price !== undefined ? `${formatMoney(price, currency)}/${cycle}` : "Contact us"}
              </p>
              <dl className="mt-4 space-y-2.5">
                {allSpecs.map((label) => (
                  <div key={label} className="flex items-center justify-between gap-3 text-sm">
                    <dt className="text-muted">{label}</dt>
                    <dd className="text-right font-semibold text-slate-800">{rowValue(plan, label)}</dd>
                  </div>
                ))}
              </dl>
              <a
                href={orderHref(plan, cycle)}
                className={`mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-bold ${
                  plan.popular ? "btn-gradient" : "border border-primary/30 text-primary hover:bg-primary hover:text-white"
                }`}
              >
                Order Now
                <Icon name="arrow-right" size={15} />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
