import type { Metadata } from "next";
import Link from "next/link";
import { loadSiteContent } from "@/lib/site-config";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service & Acceptable Use Policy (AUP) for using chvhost hosting services.",
};

export default function TermsPage() {
  const content = loadSiteContent();
  const sections = content.legal.terms;

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Service & AUP"
        subtitle="The agreement that governs use of chvhost services — including our 3-day conditional refund policy, fair usage rules, and acceptable use guidelines. Last updated: August 2026."
        crumb="Terms"
      />

      <section className="bg-white py-16 dark:bg-transparent">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="space-y-10">
            {sections.map((section) => (
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
            Questions about these terms? Contact us at{" "}
            <a href="mailto:thechvhost@gmail.com" className="font-semibold text-primary hover:underline">
              thechvhost@gmail.com
            </a>{" "}
            or visit the client portal at billing.chvhost.com.
          </div>
          <Link href="/" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>
      </section>
    </>
  );
}
