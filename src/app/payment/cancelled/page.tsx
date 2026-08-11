import type { Metadata } from "next";
import Link from "next/link";
import { getEnv } from "@/lib/env";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Payment Cancelled",
  robots: { index: false },
};

export default async function PaymentCancelledPage({
  searchParams,
}: {
  searchParams: Promise<{ invoice_id?: string }>;
}) {
  const { invoice_id } = await searchParams;
  const env = getEnv();
  const invoicesUrl = env.whmcsUrl
    ? `${env.whmcsUrl.replace(/\/$/, "")}/clientarea.php?action=invoices`
    : "/client-area";

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <div className="rounded-3xl border border-border-soft bg-white p-8 text-center shadow-sm sm:p-12">
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500">
          <Icon name="warning" size={32} />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Payment Not Completed
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
          Your invoice{invoice_id ? ` #${invoice_id}` : ""} remains unpaid — no service has been
          activated. You can retry the payment anytime from your invoices page.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={invoicesUrl}
            className="btn-gradient inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
          >
            Retry Payment
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl border border-border-soft px-6 py-3 text-sm font-semibold text-slate-700 hover:border-primary/40 hover:text-primary"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
