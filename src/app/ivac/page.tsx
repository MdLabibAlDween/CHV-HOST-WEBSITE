import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";

export const metadata: Metadata = {
  title: "IVAC Service",
  description:
    "IVAC (IVR/Voice-based automation) services in Bangladesh — secure infrastructure for voice and automation workloads.",
};

export default function IvacServicePage() {
  return (
    <CategoryPage
      category="ivac"
      eyebrow="IVAC Service"
      title="IVAC infrastructure for automation"
      subtitle="Secure, low-latency environments built for IVAC (voice automation) workloads with dedicated resources."
      crumb="IVAC Service"
      featuresEyebrow="Why IVAC service"
      featuresTitle="Built for high-volume automation"
      featuresSubtitle="Stable, always-on environments for voice, dialer and automation platforms."
      features={[
        { icon: "shield", title: "Hardened Environment", description: "Security-first configuration by default." },
        { icon: "globe", title: "Low-Latency Network", description: "Local BDIX peering keeps traffic fast." },
        { icon: "cpu", title: "Dedicated Resources", description: "CPU and RAM reserved for your workload." },
        { icon: "database", title: "NVMe Storage", description: "Fast disk for call logs and records." },
        { icon: "activity", title: "High Availability", description: "Redundant power and network paths." },
        { icon: "headphones", title: "Dedicated Support", description: "A support line that knows your setup." },
        { icon: "clock", title: "Rapid Setup", description: "Provisioned and configured quickly." },
        { icon: "server", title: "Remote Access", description: "Secure remote management included." },
      ]}
      faqTitle="IVAC service questions"
      ctaTitle="Set up your IVAC environment"
      ctaSubtitle="Contact us with your requirements and we will provision the right infrastructure."
      ctaPrimary="Order IVAC Service"
      ctaSecondary="Talk to Sales"
      ctaSecondaryHref="/contact"
    />
  );
}