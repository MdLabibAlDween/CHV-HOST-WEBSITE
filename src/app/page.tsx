import type { Metadata } from "next";
import Link from "next/link";
import { loadSiteContent } from "@/lib/site-config";
import { fetchPlans, plansByCategory } from "@/lib/providers";
import { SectionHeading } from "@/components/section-heading";
import { FeatureCard } from "@/components/feature-card";
import { TestimonialCard } from "@/components/testimonial-card";
import { FAQAccordion } from "@/components/faq-accordion";
import { CTASection } from "@/components/cta-section";
import { PricingSection } from "@/components/pricing-section";
import { DomainSearch } from "@/components/domain-search";
import { Icon, type IconName } from "@/components/icons";

export const metadata: Metadata = {
  title: "Cheap Hosting & VPS in Bangladesh",
  description:
    "CHV HOST — cheap web hosting and VPS in Bangladesh. NVMe SSD, LiteSpeed, free SSL, daily backups and 24/7 local support. Search domains and launch today.",
};

const CATEGORY_ICONS: Record<string, IconName> = {
  web: "globe",
  bdix: "network",
  turbo: "bolt",
  reseller: "layers",
  vps: "server",
  "bdix-vps": "map-pin",
  domain: "globe-2",
};

const WHY_ICONS: Record<string, IconName> = {
  database: "database",
  zap: "zap",
  shield: "shield",
  clock: "clock",
  lock: "lock",
  headphones: "headphones",
  panel: "panel",
  cpu: "cpu",
};

export default async function HomePage() {
  const content = loadSiteContent();
  const { plans } = await fetchPlans();
  const featured = plansByCategory(plans, "web").slice(0, 4);

  return (
    <>
      {/* ------------------------------- Hero ------------------------------- */}
      <section className="relative overflow-hidden bg-ink">
        <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
        <div
          className="absolute -top-40 left-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{
            backgroundImage: "linear-gradient(120deg, var(--brand-primary), var(--brand-secondary))",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 right-10 h-80 w-80 rounded-full opacity-15 blur-3xl"
          style={{ background: "var(--brand-secondary)" }}
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-ink-soft">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {content.company.tagline} · {content.stats[3]?.value ?? "24/7"} support
            </p>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {content.hero.headline}
              <br />
              <span className="gradient-text">{content.hero.highlight}</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg">
              {content.hero.subheadline}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={content.hero.primaryCta.href}
                className="btn-gradient inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold"
              >
                {content.hero.primaryCta.label}
                <Icon name="arrow-right" size={17} />
              </Link>
              <Link
                href={content.hero.secondaryCta.href}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:border-white/40"
              >
                <Icon name="search" size={17} />
                {content.hero.secondaryCta.label}
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {content.hero.points.map((point) => (
                <li key={point} className="flex items-center gap-2 text-sm text-ink-soft">
                  <Icon name="check-circle" size={16} className="text-emerald-400" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Hero visual — original, CSS-built */}
          <div className="relative hidden lg:block" aria-hidden="true">
            <div className="glass-card relative rounded-3xl p-6">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-400/80" />
                <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              </div>
              <pre className="mt-5 overflow-x-auto text-[13px] leading-relaxed text-ink-soft">
{`$ chv deploy --plan business
✓ Hosting account created
✓ SSL certificate issued
✓ DNS propagated

  Name       chv-host
  Server     LiteSpeed · NVMe
  Uptime     ██████████ 99.9%
  Speed      0.12s TTFB`}
              </pre>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                  <p className="text-lg font-extrabold text-white">99.9%</p>
                  <p className="text-[10px] uppercase tracking-wider text-ink-soft">Uptime</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                  <p className="text-lg font-extrabold text-white">NVMe</p>
                  <p className="text-[10px] uppercase tracking-wider text-ink-soft">Storage</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                  <p className="text-lg font-extrabold text-white">Lite</p>
                  <p className="text-[10px] uppercase tracking-wider text-ink-soft">Speed</p>
                </div>
              </div>
            </div>
            <div className="glass-card absolute -bottom-8 -left-8 hidden rounded-2xl px-5 py-4 xl:block">
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                <Icon name="shield" size={18} className="text-emerald-400" />
                DDoS Protection Active
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ Statistics ----------------------------- */}
      <section className="border-b border-border-soft bg-white" aria-label="Company statistics">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-5 lg:px-8">
          {content.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="gradient-text text-3xl font-extrabold tracking-tight sm:text-4xl">
                {stat.value}
                {stat.suffix}
              </p>
              <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------- Hosting categories -------------------------- */}
      <section className="bg-slate-50 py-20" aria-labelledby="categories-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What we offer"
            title="Hosting for every need"
            subtitle="From your first website to a full hosting business — pick the service that fits."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {content.categories.map((category) => (
              <Link
                key={category.id}
                href={category.href}
                className="group rounded-2xl border border-border-soft bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-slate-900/5"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl btn-gradient text-white">
                  <Icon name={CATEGORY_ICONS[category.id] ?? "globe"} size={22} />
                </span>
                <h3 className="mt-4 text-base font-bold text-slate-900">{category.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{category.description}</p>
                <p className="mt-3 text-sm">
                  <span className="font-extrabold text-slate-900">{category.startingPrice}</span>
                </p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  {category.cta}
                  <Icon
                    name="arrow-right"
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------- Featured plans --------------------------- */}
      <section className="bg-white py-20" aria-labelledby="plans-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Web hosting"
            title="Plans built for every budget"
            subtitle="All plans include cPanel, LiteSpeed, free SSL, daily backups and 24/7 support."
          />
          <div className="mt-12">
            <PricingSection plans={featured} />
          </div>
          <p className="mt-6 text-center text-xs text-muted">
            Prices shown in BDT/USD. Switch billing cycles and currency above. Final prices are
            confirmed in our billing system at checkout.
          </p>
        </div>
      </section>

      {/* ----------------------------- Domain search ---------------------------- */}
      <section className="relative overflow-hidden bg-ink py-20" aria-labelledby="domain-heading">
        <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
        <div
          className="absolute -top-24 right-1/4 h-72 w-96 rounded-full opacity-20 blur-3xl"
          style={{
            backgroundImage: "linear-gradient(120deg, var(--brand-primary), var(--brand-secondary))",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading
            dark
            eyebrow="Domains"
            title="Find your perfect domain"
            subtitle="Search availability across 40+ extensions with transparent registration and renewal pricing."
          />
          <div className="mt-10">
            <DomainSearch />
          </div>
        </div>
      </section>

      {/* ----------------------------- Why choose us ---------------------------- */}
      <section className="bg-white py-20" aria-labelledby="why-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why CHV HOST"
            title="Everything your website needs to thrive"
            subtitle="Infrastructure, security and support — handled so you can focus on building."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {content.whyChooseUs.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={WHY_ICONS[feature.icon] ?? "check"}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------- Infrastructure ---------------------------- */}
      <section className="border-y border-border-soft bg-slate-50 py-14" aria-labelledby="infra-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <h2 id="infra-heading" className="text-xl font-extrabold text-slate-900 sm:text-2xl">
              Enterprise-grade infrastructure
            </h2>
            <ul className="flex flex-wrap justify-center gap-2.5">
              {content.infrastructure.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border-soft bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  <Icon name="check-circle" size={15} className="text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------ Testimonials ----------------------------- */}
      <section className="bg-white py-20" aria-labelledby="reviews-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Customer reviews"
            title="Trusted by businesses across Bangladesh"
            subtitle="Real experiences from real customers hosting with us."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {content.testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------- FAQ --------------------------------- */}
      <section className="bg-slate-50 py-20" aria-labelledby="faq-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
            subtitle="Quick answers to the questions we hear most."
          />
          <div className="mt-10">
            <FAQAccordion items={content.faqs} />
          </div>
        </div>
      </section>

      {/* ------------------------------- Final CTA ------------------------------- */}
      <CTASection
        title={content.finalCta.title}
        subtitle={content.finalCta.subtitle}
        primaryLabel={content.finalCta.primaryLabel}
        secondaryLabel={content.finalCta.secondaryLabel}
      />
    </>
  );
}
