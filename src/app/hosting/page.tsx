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
  title: "Web Hosting Plans",
  description:
    "Affordable web hosting in Bangladesh with NVMe storage, cPanel, LiteSpeed, free SSL and daily backups. Plans from ৳49/month.",
};

export default async function HostingPage() {
  const content = loadSiteContent();
  const { plans } = await fetchPlans();
  const categoryPlans = plansByCategory(plans, "web");

  return (
    <>
      <PageHeader
        eyebrow="Web Hosting"
        title="Fast, reliable web hosting in Bangladesh"
        subtitle="cPanel, NVMe SSD storage, LiteSpeed servers, free SSL and daily backups — everything your website needs, without the bloated price tag."
        crumb="Web Hosting"
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CategoryPricing plans={categoryPlans} />
        </div>
      </section>

      <section className="border-y border-border-soft bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Included in every plan"
            title="Everything included, no hidden fees"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard icon="database" title="NVMe SSD Storage" description="Up to 20x faster disk I/O than traditional HDD hosting." />
            <FeatureCard icon="zap" title="LiteSpeed Servers" description="LiteSpeed Web Server with LSCache for dramatically faster page loads." />
            <FeatureCard icon="shield" title="Free SSL" description="Free SSL certificates on every account, automatically installed." />
            <FeatureCard icon="clock" title="Daily Backups" description="Automated daily backups with easy restores from cPanel." />
            <FeatureCard icon="panel" title="cPanel Control Panel" description="Manage files, email, databases and domains with the industry standard." />
            <FeatureCard icon="lock" title="Security Suite" description="Proactive firewall, malware scanning and DDoS protection." />
            <FeatureCard icon="mail" title="Email Accounts" description="Unlimited email accounts with webmail and spam filtering." />
            <FeatureCard icon="headphones" title="24/7 Support" description="Real people on live chat, email and tickets, around the clock." />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="FAQ" title="Web hosting questions" />
          <div className="mt-10">
            <FAQAccordion items={content.faqs.slice(0, 4)} />
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to launch your website?"
        subtitle="Get online in minutes with a free SSL, fast NVMe storage and support that actually helps."
        primaryLabel="Order Now"
        secondaryLabel="Search a Domain"
        primaryHref="/checkout"
        secondaryHref="/domains"
      />
    </>
  );
}
