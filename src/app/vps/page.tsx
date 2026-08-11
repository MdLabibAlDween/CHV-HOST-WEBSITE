import type { Metadata } from "next";
import { loadSiteContent } from "@/lib/site-config";
import { fetchPlans, plansByCategory } from "@/lib/providers";
import { PageHeader } from "@/components/page-header";
import { CategoryPricing } from "@/components/category-pricing";
import { FeatureCard } from "@/components/feature-card";
import { SectionHeading } from "@/components/section-heading";
import { FAQAccordion } from "@/components/faq-accordion";
import { CTASection } from "@/components/cta-section";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "VPS Hosting",
  description:
    "NVMe VPS with full root access, IPv4/IPv6, DDoS protection and flexible OS choices. Deploy in minutes from ৳699/month.",
};

const OS_CHOICES = ["Ubuntu", "Debian", "CentOS", "AlmaLinux", "Rocky Linux", "Windows (optional)"];

export default async function VpsPage() {
  const content = loadSiteContent();
  const { plans } = await fetchPlans();
  const categoryPlans = plansByCategory(plans, "vps");

  return (
    <>
      <PageHeader
        eyebrow="VPS Hosting"
        title="Full-control virtual servers, deployed in minutes"
        subtitle="NVMe storage, dedicated vCPU cores, root access and DDoS protection. Scale from a single app to production workloads."
        crumb="VPS"
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CategoryPricing plans={categoryPlans} />
        </div>
      </section>

      <section className="border-y border-border-soft bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Specifications"
            title="Enterprise hardware, individual control"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard icon="cpu" title="Dedicated vCPU Cores" description="Guaranteed CPU cores — no noisy neighbors." />
            <FeatureCard icon="database" title="NVMe Storage" description="Low-latency NVMe SSDs for databases and apps." />
            <FeatureCard icon="key" title="Full Root Access" description="Install anything. Rebuild anytime from your panel." />
            <FeatureCard icon="globe-2" title="IPv4 + IPv6" description="Every server ships with IPv4 and IPv6 addresses." />
            <FeatureCard icon="shield" title="DDoS Protection" description="Always-on network-level mitigation." />
            <FeatureCard icon="activity" title="1 Gbps Network" description="High-throughput uplink on all plans." />
            <FeatureCard icon="clock" title="Snapshot Backups" description="Optional automated snapshots and restores." />
            <FeatureCard icon="headphones" title="24/7 Support" description="Our team manages the hypervisor; you own the OS." />
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-3xl border border-border-soft bg-gradient-to-br from-slate-50 to-white p-8 shadow-sm sm:p-10">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900">
              <Icon name="check-circle" size={22} className="text-primary" />
              OS &amp; control panel choices
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {OS_CHOICES.map((os) => (
                <li key={os} className="flex items-center gap-2.5 rounded-xl border border-border-soft bg-white px-4 py-3 text-sm font-medium text-slate-700">
                  <Icon name="check" size={16} className="text-emerald-500" />
                  {os}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-muted">
              Choose your OS at deployment time. Optional managed add-ons include control panels
              (cPanel/WHM or a lightweight panel), firewall hardening and monitoring — configured by
              our team.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="FAQ" title="VPS questions" />
          <div className="mt-10">
            <FAQAccordion
              items={[
                ...content.faqs.slice(0, 2),
                {
                  question: "How fast is my VPS deployed?",
                  answer:
                    "VPS servers are provisioned automatically within minutes of payment confirmation. You receive the IP and root credentials by email and in your client area.",
                },
                {
                  question: "Can I upgrade my VPS later?",
                  answer:
                    "Yes — upgrade CPU, RAM or storage at any time from your client area. Most upgrades apply live without reinstalling the operating system.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      <CTASection
        title="Deploy your VPS in minutes"
        subtitle="Root access, NVMe speed and DDoS protection — with pricing that scales with you."
        primaryLabel="Deploy VPS"
        secondaryLabel="See BDIX VPS"
        secondaryHref="/bdix-vps"
      />
    </>
  );
}
