import type { Metadata } from "next";
import { loadSiteContent } from "@/lib/site-config";
import { fetchPlans, plansByCategory } from "@/lib/providers";
import { PageHeader } from "@/components/page-header";
import { CategoryPricing } from "@/components/category-pricing";
import { FeatureCard } from "@/components/feature-card";
import { SectionHeading } from "@/components/section-heading";
import { FAQAccordion } from "@/components/faq-accordion";
import { CTASection } from "@/components/cta-section";

export const metadata: Metadata = {
  title: "BDIX VPS",
  description:
    "BDIX VPS with low-latency local connectivity, NVMe storage, root access and DDoS protection. From ৳899/month.",
};

export default async function BdixVpsPage() {
  const content = loadSiteContent();
  const { plans } = await fetchPlans();
  const categoryPlans = plansByCategory(plans, "bdix-vps");

  return (
    <>
      <PageHeader
        eyebrow="BDIX VPS"
        title="Local VPS on the BDIX network"
        subtitle="Full root-access servers with direct BDIX peering — sub-10ms latency for Bangladeshi users and applications."
        crumb="BDIX VPS"
      />

      <section className="bg-white py-16 sm:py-20 dark:bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CategoryPricing plans={categoryPlans} />
        </div>
      </section>

      <section className="border-y border-border-soft bg-slate-50 py-16 dark:border-white/10 dark:bg-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why BDIX VPS"
            title="Local hosting power, minus the latency"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard icon="network" title="BDIX Connectivity" description="Direct Bangladesh Internet Exchange peering." />
            <FeatureCard icon="gauge" title="Low Local Latency" description="Sub-10ms responses for national visitors." />
            <FeatureCard icon="database" title="NVMe Storage" description="Fast local NVMe drives." />
            <FeatureCard icon="key" title="Root Access" description="Full root with your choice of OS." />
            <FeatureCard icon="cpu" title="CPU & RAM Options" description="Scaling from 1 vCPU / 2 GB to 4 vCPU / 8 GB." />
            <FeatureCard icon="map-pin" title="Local Data Center" description="Servers housed in Bangladesh data centers." />
            <FeatureCard icon="clock" title="Backup Options" description="Snapshot and automated backup add-ons." />
            <FeatureCard icon="shield" title="DDoS Protection" description="Network-level mitigation included." />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border-soft bg-gradient-to-br from-slate-50 to-white p-8 shadow-sm sm:p-10 dark:border-white/10 dark:from-white/5 dark:to-transparent">
            <SectionHeading
              align="left"
              eyebrow="Ideal for"
              title="Who is BDIX VPS for?"
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                "E-commerce stores serving Bangladeshi customers",
                "Local portals, news and community sites",
                "Apps and services targeting national users",
                "Agencies running client projects in Bangladesh",
              ].map((item) => (
                <p key={item} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <span className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full btn-gradient" aria-hidden="true" />
                  {item}
                </p>
              ))}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-muted">
              Optional managed services available: OS hardening, control panels, monitoring and
              ongoing administration by our team.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 dark:bg-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="FAQ" title="BDIX VPS questions" />
          <div className="mt-10">
            <FAQAccordion items={content.faqs.slice(0, 3)} />
          </div>
        </div>
      </section>

      <CTASection
        title="Run your local workloads on local servers"
        subtitle="BDIX VPS with root access, NVMe storage and support that speaks your language."
        primaryLabel="Deploy BDIX VPS"
        secondaryLabel="Compare VPS Plans"
        secondaryHref="/vps"
      />
    </>
  );
}
