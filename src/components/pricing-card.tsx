import type { HostingPlan, BillingCycle, CurrencyCode } from "@/lib/site-types";
import { formatMoney, cyclePerLabel, priceKey } from "@/lib/format";
import { Icon } from "@/components/icons";
import { orderHref } from "@/lib/order";

export function PricingCard({
  plan,
  cycle,
  currency,
}: {
  plan: HostingPlan;
  cycle: BillingCycle;
  currency: CurrencyCode;
}) {
  const price = plan.prices[priceKey(currency)][cycle];
  const hasPrice = price !== undefined;
  const href = orderHref(plan, cycle);

  return (
    <div
      className={`relative flex h-full flex-col rounded-3xl border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/8 ${
        plan.popular
          ? "border-transparent shadow-lg shadow-primary/15 [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(120deg,var(--brand-primary),var(--brand-secondary))_border-box]"
          : "border-border-soft shadow-sm"
      }`}
    >
      {plan.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full btn-gradient px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
          {plan.badge}
        </span>
      )}
      {plan.popular && !plan.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full btn-gradient px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
          Most Popular
        </span>
      )}

      <h3 className="text-lg font-extrabold text-slate-900">{plan.name}</h3>
      <p className="mt-1 text-sm text-muted">{plan.tagline}</p>

      <div className="mt-5 flex items-baseline gap-1.5">
        {hasPrice ? (
          <>
            <span className="text-4xl font-extrabold tracking-tight text-slate-900">
              {formatMoney(price, currency)}
            </span>
            <span className="text-sm text-muted">{cyclePerLabel(cycle)}</span>
          </>
        ) : (
          <span className="text-lg font-semibold text-muted">Contact us</span>
        )}
      </div>

      <ul className="mt-6 flex-1 space-y-2.5 text-sm text-slate-700">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <Icon name="check" size={16} className="mt-0.5 shrink-0 text-emerald-500" />
            {feature}
          </li>
        ))}
      </ul>

      <a
        href={href}
        className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
          plan.popular
            ? "btn-gradient"
            : "border border-primary/30 text-primary hover:border-primary hover:bg-primary hover:text-white"
        }`}
      >
        Order Now
        <Icon name="arrow-right" size={16} />
      </a>
    </div>
  );
}
