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

export const metadata: Metadata = {
  title: "Reseller Hosting",
  description:
    "White-label reseller hosting with WHM, custom nameservers and cPanel account management. Start your own hosting business from ৳299/month.",
};

const RESELLER_STEPS = [
  {
    title: "Choose a plan",
    description: "Pick the number of cPanel accounts and resources you need. Upgrade anytime.",
  },
  {
    title: "Set up WHM",
    description: "Create cPanel accounts, allocate resources and manage your clients from WHM.",
  },
  {
    title: "Brand it yours",
    description: "White-label everything — your logo, your nameservers, your brand, your prices.",
  },
  {
    title: "Get paid",
    description: "We bill you on our platform; you invoice your own customers however you like.",
  },
];

export default async function ResellerHostingPage() {
  const { whmcsUrl } = getPublicEnv();
  const content = loadSiteContent();
  const { plans } = await fetchPlans();
  const categoryPlans = plansByCategory(plans, "reseller");

  return (
    <>
      <PageHeader
        eyebrow="Reseller Hosting"
        title="Start your own hosting business"
        subtitle="White-label reseller hosting with full WHM access, custom nameservers and automated billing — build your brand, not infrastructure."
        crumb="Reseller Hosting"
      />

      <section className="bg-white py-16 sm:py-20 dark:bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CategoryPricing plans={categoryPlans} whmcsUrl={whmcsUrl} />
        </div>
      </section>

      <section className="border-y border-border-soft bg-slate-50 py-16 dark:border-white/10 dark:bg-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How it works"
            title="From zero to hosting provider in four steps"
          />
          <ol className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {RESELLER_STEPS.map((step, index) => (
              <li key={step.title} className="relative rounded-2xl border border-border-soft bg-card p-6 dark:border-white/10">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg btn-gradient text-sm font-extrabold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-slate-100">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Everything included"
            title="Your hosting business, fully equipped"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard icon="panel" title="Full WHM Access" description="Create, suspend and manage every cPanel account." />
            <FeatureCard icon="user" title="cPanel Accounts" description="Scalable account quotas per plan — 20 to unlimited." />
            <FeatureCard icon="sparkles" title="White-Label Hosting" description="Remove our branding. Your logo, your look." />
            <FeatureCard icon="sitemap" title="Custom Nameservers" description="Use your own nameservers: ns1.yourbrand.com." />
            <FeatureCard icon="chart" title="Resource Allocation" description="Set storage, bandwidth and feature limits per client." />
            <FeatureCard icon="folder" title="Client Management" description="Package groups, feature lists and per-account controls." />
            <FeatureCard icon="credit-card" title="Automated Billing" description="WHMCS handles invoicing, renewals and payment automation." />
            <FeatureCard icon="headphones" title="Support" description="Infrastructure issues are on us — 24/7, escalated fast." />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 dark:bg-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="FAQ" title="Reseller questions" />
          <div className="mt-10">
            <FAQAccordion
              items={[
                ...content.faqs.slice(0, 2),
                {
                  question: "Can I use my own domain and nameservers?",
                  answer:
                    "Yes. Reseller plans include custom nameservers (ns1.yourdomain.com / ns2.yourdomain.com) and full white-label branding — your customers will never see our name.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      <CTASection
        title="Start reselling today"
        subtitle="Join resellers running their own hosting brands on CHV HOST infrastructure."
        primaryLabel="Start Reselling"
        secondaryLabel="Talk to Sales"
        secondaryHref="/contact"
      />
    </>
  );
}
