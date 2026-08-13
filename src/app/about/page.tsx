import type { Metadata } from "next";
import { loadSiteContent } from "@/lib/site-config";
import { getPublicEnv } from "@/lib/env";
import { PageHeader } from "@/components/page-header";
import { SectionHeading } from "@/components/section-heading";
import { FeatureCard } from "@/components/feature-card";
import { CTASection } from "@/components/cta-section";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "About CHV HOST — a Bangladesh-based hosting company delivering cheap, reliable hosting and VPS with 24/7 local support.",
};

export default function AboutPage() {
  const env = getPublicEnv();
  const content = loadSiteContent();

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Hosting that's cheap — never cheaply made"
        subtitle="CHV HOST exists for one reason: world-class hosting shouldn't cost a fortune, and it should be supported by people who speak your language."
        crumb="About"
      />

      <section className="bg-white py-16 sm:py-20 dark:bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Our story"
                title="Built in Bangladesh, for Bangladesh"
              />
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
                <p>
                  {env.siteName} started in {content.company.founded} with a simple observation:
                  Bangladeshi businesses were paying international prices for hosting that performed
                  poorly for local visitors. International servers meant slow page loads, and local
                  options often meant outdated infrastructure.
                </p>
                <p>
                  We built {env.siteName} on modern NVMe hardware with direct BDIX connectivity,
                  LiteSpeed servers and transparent pricing. No setup fees, no hidden charges, no
                  fine-print surprises.
                </p>
                <p>
                  Today we host thousands of websites, from personal blogs to busy e-commerce
                  stores — and every single customer gets support from real people, in Bengali or
                  English, 24/7.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {content.stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border-soft bg-slate-50 p-4 text-center sm:p-6 dark:border-white/10 dark:bg-white/5">
                  <p className="gradient-text text-2xl font-extrabold sm:text-3xl">{stat.value}{stat.suffix}</p>
                  <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border-soft bg-slate-50 py-16 dark:border-white/10 dark:bg-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Our values" title="What we stand for" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard icon="credit-card" title="Honest Pricing" description="The price you see is the price you pay. Ever." />
            <FeatureCard icon="zap" title="Modern Hardware" description="NVMe storage and LiteSpeed on every plan." />
            <FeatureCard icon="headphones" title="Real Support" description="Local team, in your language, around the clock." />
            <FeatureCard icon="lock" title="Your Data, Safe" description="Daily backups, SSL everywhere, strict privacy." />
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
