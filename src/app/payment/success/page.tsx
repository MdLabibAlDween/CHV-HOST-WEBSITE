import type { Metadata } from "next";
import Link from "next/link";
import { getEnv } from "@/lib/env";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Payment Successful",
  robots: { index: false },
};

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ invoice_id?: string }>;
}) {
  const { invoice_id } = await searchParams;
  const env = getEnv();
  const clientArea = env.whmcsUrl ? `${env.whmcsUrl.replace(/\/$/, "")}/clientarea.php` : "/client-area";

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <div className="rounded-3xl border border-border-soft bg-white p-8 text-center shadow-sm sm:p-12">
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
          <Icon name="check-circle" size={34} />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-slate-900 sm:text-3xl">Payment Successful</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
          Thank you! Your payment has been verified{invoice_id ? ` (invoice #${invoice_id})` : ""}.
          Your hosting service will be activated automatically within a few minutes. We&apos;ve
          emailed your account credentials.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={clientArea}
            className="btn-gradient inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
          >
            Go to Client Area
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border-soft px-6 py-3 text-sm font-semibold text-slate-700 hover:border-primary/40 hover:text-primary"
          >
            Back to Home
          </Link>
        </div>
        <p className="mt-6 text-xs text-muted">
          Payments are verified server-side before your service is activated.
        </p>
      </div>
    </div>
  );
}
