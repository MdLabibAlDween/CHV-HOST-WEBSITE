import type { Metadata } from "next";
import { loadSiteContent } from "@/lib/site-config";
import { fetchPlans, plansByCategory } from "@/lib/providers";
import { PageHeader } from "@/components/page-header";
import { CategoryPricing } from "@/components/category-pricing";
import { getPublicEnv } from "@/lib/env";
import { FeatureCard } from "@/components/feature-card";
import { SectionHeading } from "@/components/section-heading";
import { FAQAccordion } from "@/components/faq-accordion";
import { CTASection } from "@/components/cta-section";
import { Icon } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "BDIX Hosting",
  description:
    "BDIX hosting for Bangladesh with local connectivity, low latency and NVMe storage. Fast pages for Bangladeshi visitors, from ৳69/month.",
};

export default async function BdixHostingPage() {
  const { whmcsUrl } = getPublicEnv();
  const content = loadSiteContent();
  const { plans } = await fetchPlans();
  const categoryPlans = plansByCategory(plans, "bdix");

  return (
    <>
      <PageHeader
        eyebrow="BDIX Hosting"
        title="Lightning-fast hosting for Bangladeshi visitors"
        subtitle="Your site is served over the local BDIX network — lower latency, faster loading and a better experience for visitors in Bangladesh."
        crumb="BDIX Hosting"
      />

      <section className="bg-white py-16 sm:py-20 dark:bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CategoryPricing plans={categoryPlans} whmcsUrl={whmcsUrl} />
        </div>
      </section>

      <section className="border-y border-border-soft bg-slate-50 py-16 dark:border-white/10 dark:bg-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why BDIX hosting"
            title="Local network. Local speed."
            subtitle="Most international hosts route Bangladeshi traffic through slow international links. BDIX hosting keeps traffic local."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard icon="network" title="BDIX Connectivity" description="Direct peering on the Bangladesh Internet Exchange — no international round-trips." />
            <FeatureCard icon="gauge" title="Low Latency" description="Sub-10ms responses for Dhaka and national visitors." />
            <FeatureCard icon="database" title="NVMe Storage" description="Fast local NVMe drives for every account." />
            <FeatureCard icon="shield" title="Free SSL" description="Free SSL certificates on all domains, auto-installed." />
            <FeatureCard icon="clock" title="Daily Backups" description="Automated daily backups for peace of mind." />
            <FeatureCard icon="panel" title="cPanel Included" description="Full cPanel with LiteSpeed, email and databases." />
            <FeatureCard icon="lock" title="Security" description="Firewall, malware scanning and DDoS protection." />
            <FeatureCard icon="headphones" title="Local Support" description="Talk to our team in your language, any time." />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-transparent">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-3xl border border-border-soft bg-gradient-to-br from-slate-50 to-white p-8 shadow-sm sm:p-10 dark:border-white/10 dark:from-white/5 dark:to-transparent">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900 dark:text-slate-100">
              <Icon name="activity" size={22} className="text-primary" />
              How BDIX hosting works
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
              When someone in Bangladesh opens your website, their request would normally travel to a
              server abroad and back. With BDIX hosting, your site is served from a data center with
              direct peering on the Bangladesh Internet Exchange, so the round trip stays inside the
              country. Pages load dramatically faster for local visitors — ideal for Bangladeshi
              businesses, e-commerce stores and local communities.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Direct BDIX peering with redundant international uplink",
                "Faster TTFB for Bangladesh-based visitors",
                "Same features as our regular hosting: cPanel, LiteSpeed, SSL, backups",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <Icon name="check-circle" size={17} className="mt-0.5 shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 dark:bg-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="FAQ" title="BDIX hosting questions" />
          <div className="mt-10">
            <FAQAccordion items={content.faqs.slice(0, 3)} />
          </div>
        </div>
      </section>

      <CTASection
        title="Give your local visitors the speed they deserve"
        subtitle="Switch to BDIX hosting today — migrations are free and handled by our team."
        primaryLabel="Order BDIX Hosting"
        secondaryLabel="Contact Us"
        secondaryHref="/contact"
      />
    </>
  );
}
