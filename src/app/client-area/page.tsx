import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { whmcsClientAreaUrl } from "@/lib/whmcs";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Client Area",
  description: "Login to manage your hosting services, domains, invoices and support tickets.",
};

export default function ClientAreaPage() {
  const clientAreaUrl = whmcsClientAreaUrl("clientarea.php");
  if (clientAreaUrl) {
    redirect(clientAreaUrl);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <div className="rounded-3xl border border-border-soft bg-white p-8 text-center shadow-sm sm:p-12">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl btn-gradient text-white">
          <Icon name="user" size={26} />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-slate-900 sm:text-3xl">
          The Client Area is opening soon
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
          Your client area — services, domains, invoices and tickets — lives in our WHMCS billing
          system. We&apos;re finishing the connection. Once live, this page will take you straight
          there.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/pricing"
            className="btn-gradient inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
          >
            View Hosting Plans
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
