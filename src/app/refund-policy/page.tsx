import type { Metadata } from "next";
import Link from "next/link";
import { loadSiteContent } from "@/lib/site-config";
import { getPublicEnv } from "@/lib/env";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "CHV HOST refund policy — 7-day money-back guarantee on shared hosting and pro-rata VPS refunds.",
};

export default function RefundPolicyPage() {
  const content = loadSiteContent();
  const env = getPublicEnv();

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Refund Policy"
        subtitle="Fair, transparent refunds. If we don't deliver, you get your money back."
        crumb="Refund Policy"
      />

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="space-y-8">
            {content.legal.refund.map((section) => (
              <div key={section.heading}>
                <h2 className="text-lg font-extrabold text-slate-900">{section.heading}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{section.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 rounded-2xl border border-border-soft bg-slate-50 p-6 text-sm text-muted">
            To request a refund, open a ticket in your client area or email{" "}
            <a href={`mailto:${env.salesEmail}`} className="font-semibold text-primary hover:underline">
              {env.salesEmail}
            </a>
          </div>
          <Link href="/" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>
      </section>
    </>
  );
}
