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

      <section className="bg-white py-16 dark:bg-transparent">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="space-y-10">
            {content.legal.refund.map((section) => (
              <div key={section.heading}>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{section.heading}</h2>
                {section.body && (
                  <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{section.body}</p>
                )}
                {section.items && (
                  <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted sm:text-base">
                    {section.items.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.subsections && (
                  <div className="mt-4 space-y-6 pl-4 sm:pl-6">
                    {section.subsections.map((sub) => (
                      <div key={sub.heading}>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{sub.heading}</h3>
                        {sub.body && (
                          <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{sub.body}</p>
                        )}
                        {sub.items && (
                          <ul className="mt-2 space-y-2.5 text-sm leading-relaxed text-muted sm:text-base">
                            {sub.items.map((item) => (
                              <li key={item} className="flex gap-2.5">
                                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-12 rounded-2xl border border-border-soft bg-slate-50 p-6 text-sm text-muted dark:border-white/10 dark:bg-white/5">
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
