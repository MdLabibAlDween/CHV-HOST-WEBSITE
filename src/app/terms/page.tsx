import type { Metadata } from "next";
import Link from "next/link";
import { loadSiteContent } from "@/lib/site-config";
import { getPublicEnv } from "@/lib/env";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for using CHV HOST hosting services.",
};

export default function TermsPage() {
  const content = loadSiteContent();
  const env = getPublicEnv();
  const sections = content.legal.terms;

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Service"
        subtitle="The agreement that governs use of CHV HOST services. Last updated with the current billing cycle terms."
        crumb="Terms"
      />

      <section className="bg-white py-16 dark:bg-transparent">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.heading}>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{section.heading}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{section.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 rounded-2xl border border-border-soft bg-slate-50 p-6 text-sm text-muted dark:border-white/10 dark:bg-white/5">
            Questions about these terms? Contact us at{" "}
            <a href={`mailto:${env.supportEmail}`} className="font-semibold text-primary hover:underline">
              {env.supportEmail}
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
