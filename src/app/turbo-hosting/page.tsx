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
  title: "Turbo Hosting",
  description:
    "Turbo hosting with higher CPU allocation, NVMe storage, LiteSpeed + LSCache and advanced backups. Maximum performance from ৳129/month.",
};

export default async function TurboHostingPage() {
  const content = loadSiteContent();
  const { plans } = await fetchPlans();
  const categoryPlans = plansByCategory(plans, "turbo");

  return (
    <>
      <PageHeader
        eyebrow="Turbo Hosting"
        title="The fastest shared hosting we offer"
        subtitle="Dedicated CPU allocation, NVMe storage and LiteSpeed + LSCache — engineered for speed-critical sites, stores and media-heavy projects."
        crumb="Turbo Hosting"
      />

      <section className="bg-white py-16 sm:py-20 dark:bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CategoryPricing plans={categoryPlans} />
        </div>
      </section>

      <section className="border-y border-border-soft bg-slate-50 py-16 dark:border-white/10 dark:bg-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why Turbo"
            title="Every millisecond counts"
            subtitle="Turbo plans isolate more server resources for your account so your site never competes for power."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard icon="cpu" title="Higher CPU Allocation" description="2x–6x more CPU capacity than standard plans for heavy workloads." />
            <FeatureCard icon="database" title="NVMe Storage" description="Enterprise NVMe drives with up to 20x faster I/O." />
            <FeatureCard icon="zap" title="LiteSpeed + LSCache" description="LiteSpeed Web Server with full LSCache — WordPress sites load in an instant." />
            <FeatureCard icon="layers" title="More Websites" description="Unlimited website slots on every Turbo plan." />
            <FeatureCard icon="activity" title="Higher Resource Limits" description="More memory, processes and inode limits per account." />
            <FeatureCard icon="clock" title="Advanced Backups" description="Daily backups plus priority restores for faster recovery." />
            <FeatureCard icon="shield" title="Free SSL + Options" description="Free SSL on all domains, with optional dedicated IP on higher plans." />
            <FeatureCard icon="headphones" title="Priority Support" description="Your tickets are bumped ahead of the queue." />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="FAQ" title="Turbo hosting questions" />
          <div className="mt-10">
            <FAQAccordion items={content.faqs.slice(0, 3)} />
          </div>
        </div>
      </section>

      <CTASection
        title="Experience the speed difference"
        subtitle="Free migration from any host. If your site isn't faster, we'll make it right."
        primaryLabel="Get Turbo Hosting"
        secondaryLabel="Compare Pricing"
        secondaryHref="/pricing"
      />
    </>
  );
}
