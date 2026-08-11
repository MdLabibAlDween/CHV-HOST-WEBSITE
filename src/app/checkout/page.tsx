import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { whmcsCartUrl } from "@/lib/whmcs";
import { loadPlans } from "@/lib/site-config";
import { getEnv } from "@/lib/env";
import { Icon } from "@/components/icons";
import type { BillingCycle } from "@/lib/site-types";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your hosting order securely.",
};

/**
 * Order entry point. When WHMCS is configured this redirects into the
 * WHMCS cart (the billing source of truth). Otherwise it shows a
 * graceful message so the flow never dead-ends.
 */
export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; cycle?: string; domain?: string }>;
}) {
  const env = getEnv();
  const { plan: planId, cycle = "monthly", domain } = await searchParams;
  const plan = loadPlans().find((p) => p.id === planId);
  const validCycle = plan?.billingCycles.includes(cycle as BillingCycle) ? (cycle as BillingCycle) : "monthly";

  const cartUrl = plan?.whmcsPid
    ? whmcsCartUrl(plan.whmcsPid, validCycle, domain ? { domain } : undefined)
    : "";
  if (cartUrl) {
    redirect(cartUrl);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <div className="rounded-3xl border border-border-soft bg-white p-8 text-center shadow-sm sm:p-12">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
          <Icon name="warning" size={26} />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Checkout is not ready yet
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
          We&apos;re temporarily unable to connect to the billing system. Please try again
          shortly, or contact our sales team and we&apos;ll help you place your order manually.
        </p>

        {plan && (
          <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-border-soft bg-slate-50 p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Your selection</p>
            <p className="mt-1 text-sm font-bold text-slate-900">
              {plan.name}
              {domain ? ` + ${domain}` : ""}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={`mailto:${env.salesEmail}?subject=${encodeURIComponent(`Order help: ${plan?.name ?? "hosting plan"}`)}`}
            className="btn-gradient inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
          >
            <Icon name="mail" size={16} />
            Contact Sales
          </a>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-xl border border-border-soft px-6 py-3 text-sm font-semibold text-slate-700 hover:border-primary/40 hover:text-primary"
          >
            Back to Plans
          </Link>
        </div>
      </div>
    </div>
  );
}
