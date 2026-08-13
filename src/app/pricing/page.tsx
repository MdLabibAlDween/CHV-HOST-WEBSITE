import type { Metadata } from "next";
import { fetchPlans } from "@/lib/providers";
import { loadSiteContent } from "@/lib/site-config";
import { CATEGORY_META, type PlanCategory } from "@/lib/site-types";
import { PageHeader } from "@/components/page-header";
import { PricingTabs } from "@/components/pricing-tabs";
import { FAQAccordion } from "@/components/faq-accordion";
import { CTASection } from "@/components/cta-section";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Compare web hosting, BDIX hosting, turbo hosting, reseller hosting and VPS pricing. Monthly or yearly billing in BDT and USD.",
};

export default async function PricingPage() {
  const content = loadSiteContent();
  const { plans } = await fetchPlans();

  const categories: PlanCategory[] = ["web", "bdix", "turbo", "reseller", "vps", "bdix-vps"];

  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Simple, honest pricing"
        subtitle="No setup fees, no hidden charges. Switch between billing periods and currencies — the final price is always confirmed in our billing system."
        crumb="Pricing"
      />

      <section className="bg-white py-16 sm:py-20 dark:bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PricingTabs
            categories={categories.map((c) => ({
              id: c,
              label: CATEGORY_META[c].label,
              plans: plans.filter((p) => p.category === c),
            }))}
          />
        </div>
      </section>

      <section className="border-t border-border-soft bg-slate-50 py-16 dark:border-white/10 dark:bg-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Pricing questions"
            subtitle="Everything you need to know about billing, discounts and payments."
          />
          <div className="mt-10">
            <FAQAccordion
              items={[
                ...content.faqs.slice(0, 4),
                {
                  question: "Do you offer discounts for annual billing?",
                  answer:
                    "Yes — paying yearly saves you roughly two months compared to monthly billing. Additional coupon codes are supported in our billing system.",
                },
                {
                  question: "Which payment methods are accepted?",
                  answer:
                    "Payments are processed securely through ZiniPay, supporting bKash, Nagad, Rocket and card payments. Invoices can also be paid from your client area at any time.",
                },
              ]}
            />
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
