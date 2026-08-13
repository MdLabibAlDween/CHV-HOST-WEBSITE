import type { Metadata } from "next";
import { loadSiteContent } from "@/lib/site-config";
import { PageHeader } from "@/components/page-header";
import { FAQAccordion } from "@/components/faq-accordion";
import { CTASection } from "@/components/cta-section";
import { getPublicEnv } from "@/lib/env";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about CHV HOST — hosting, domains, billing, payments and support.",
};

export default function FaqPage() {
  const content = loadSiteContent();
  const env = getPublicEnv();

  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="How can we help?"
        subtitle="Answers to the questions we hear most. Can't find what you need? Our team is one message away."
        crumb="FAQ"
      />

      <section className="bg-white py-16 sm:py-20 dark:bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FAQAccordion items={content.faqs} />
          <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center">
            <p className="flex items-center gap-2 text-sm text-muted">
              <Icon name="life-buoy" size={17} className="text-primary" />
              Still have questions?
            </p>
            <div className="flex gap-3">
              <a
                href={env.whmcsUrl ? `${env.whmcsUrl.replace(/\/$/, "")}/submitticket.php` : "/contact"}
                className="btn-gradient rounded-xl px-6 py-3 text-sm font-bold"
              >
                Open a Ticket
              </a>
              <a
                href={`mailto:${env.supportEmail}`}
                className="inline-flex items-center gap-2 rounded-xl border border-border-soft px-6 py-3 text-sm font-semibold text-slate-700 hover:border-primary/40 hover:text-primary dark:border-white/10 dark:text-slate-300"
              >
                <Icon name="mail" size={16} />
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title={content.finalCta.title}
        subtitle={content.finalCta.subtitle}
        primaryLabel={content.finalCta.primaryLabel}
        secondaryLabel={content.finalCta.secondaryLabel}
      />
    </>
  );
}
