import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";

export const metadata: Metadata = {
  title: "Dedicated Server",
  description:
    "Dedicated servers in Bangladesh — bare-metal power with NVMe storage, full root access and custom configuration.",
};

export default function DedicatedServerPage() {
  return (
    <CategoryPage
      category="dedicated"
      eyebrow="Dedicated Server"
      title="Bare-metal power for serious workloads"
      subtitle="Whole servers, entirely yours — no neighbours, no sharing, no compromise."
      crumb="Dedicated Server"
      featuresEyebrow="Why dedicated"
      featuresTitle="Maximum performance, maximum control"
      featuresSubtitle="For high-traffic sites, big databases, game servers and heavy workloads."
      features={[
        { icon: "cpu", title: "Latest CPUs", description: "Modern multi-core processors for any load." },
        { icon: "database", title: "NVMe Storage", description: "Ultra-fast NVMe, configurable capacity." },
        { icon: "server", title: "Full Root Access", description: "Install anything, configure everything." },
        { icon: "shield", title: "DDoS Protection", description: "Always-on network-level protection." },
        { icon: "bolt", title: "Burst Bandwidth", description: "Generous bandwidth on redundant uplinks." },
        { icon: "activity", title: "99.9% Uptime SLA", description: "Backed by our infrastructure guarantees." },
        { icon: "headphones", title: "Expert Support", description: "Hardware and network issues handled fast." },
        { icon: "lock", title: "Custom Builds", description: "Configure CPU, RAM, disks and OS your way." },
      ]}
      faqTitle="Dedicated server questions"
      ctaTitle="Deploy your dedicated server"
      ctaSubtitle="Tell us what you need — we will quote and provision it in hours, not weeks."
      ctaPrimary="Order Dedicated Server"
    />
  );
}