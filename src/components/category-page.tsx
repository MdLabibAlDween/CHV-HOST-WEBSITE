import type { PlanCategory } from "@/lib/site-types";
import { loadSiteContent } from "@/lib/site-config";
import { fetchPlans, plansByCategory } from "@/lib/providers";
import { PageHeader } from "@/components/page-header";
import { CategoryPricing } from "@/components/category-pricing";
import { FeatureCard } from "@/components/feature-card";
import { SectionHeading } from "@/components/section-heading";
import { FAQAccordion } from "@/components/faq-accordion";
import { CTASection } from "@/components/cta-section";
import type { IconName } from "@/components/icons";

export interface CategoryFeature {
  icon: IconName;
  title: string;
  description: string;
}

interface CategoryPageProps {
  category: PlanCategory;
  eyebrow: string;
  title: string;
  subtitle: string;
  crumb: string;
  featuresEyebrow: string;
  featuresTitle: string;
  featuresSubtitle: string;
  features: CategoryFeature[];
  faqTitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaPrimary: string;
  ctaSecondary?: string;
  ctaSecondaryHref?: string;
}

/**
 * Standard category page: pricing (synced from WHMCS), features, FAQ
 * and CTA. New categories only need a small page file that passes copy
 * to this template — pricing itself always comes from WHMCS.
 */
export async function CategoryPage(props: CategoryPageProps) {
  const content = loadSiteContent();
  const { plans } = await fetchPlans();
  const categoryPlans = plansByCategory(plans, props.category);

  return (
    <>
      <PageHeader
        eyebrow={props.eyebrow}
        title={props.title}
        subtitle={props.subtitle}
        crumb={props.crumb}
      />

      <section className="bg-white py-16 sm:py-20 dark:bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CategoryPricing plans={categoryPlans} />
        </div>
      </section>

      <section className="border-y border-border-soft bg-slate-50 py-16 dark:border-white/10 dark:bg-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={props.featuresEyebrow}
            title={props.featuresTitle}
            subtitle={props.featuresSubtitle}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {props.features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="FAQ" title={props.faqTitle} />
          <div className="mt-10">
            <FAQAccordion items={content.faqs.slice(0, 4)} />
          </div>
        </div>
      </section>

      <CTASection
        title={props.ctaTitle}
        subtitle={props.ctaSubtitle}
        primaryLabel={props.ctaPrimary}
        secondaryLabel={props.ctaSecondary ?? "Contact Us"}
        secondaryHref={props.ctaSecondaryHref ?? "/contact"}
      />
    </>
  );
}