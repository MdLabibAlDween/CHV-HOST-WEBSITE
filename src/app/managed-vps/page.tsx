import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";

export const metadata: Metadata = {
  title: "Managed VPS",
  description:
    "Managed VPS in Bangladesh — full root access with server setup, security and updates handled by our team.",
};

export default function ManagedVpsPage() {
  return (
    <CategoryPage
      category="managed-vps"
      eyebrow="Managed VPS"
      title="VPS power, zero server stress"
      subtitle="Root access when you want it, expert management when you don't. Setup, hardening and monitoring included."
      crumb="Managed VPS"
      featuresEyebrow="Why managed VPS"
      featuresTitle="We handle the server, you run your business"
      featuresSubtitle="Full root access with our team managing the day-to-day operations."
      features={[
        { icon: "server", title: "Full Root Access", description: "Complete control whenever you need it." },
        { icon: "shield", title: "Security Hardening", description: "Firewalls, patches and audits included." },
        { icon: "refresh", title: "Updates & Maintenance", description: "OS and software kept current by our team." },
        { icon: "activity", title: "24/7 Monitoring", description: "Uptime and resource alerts handled for you." },
        { icon: "database", title: "NVMe Storage", description: "Fast local NVMe drives on every node." },
        { icon: "clock", title: "Backups", description: "Regular snapshots so you never lose work." },
        { icon: "headphones", title: "Priority Support", description: "Server issues resolved quickly by engineers." },
        { icon: "globe", title: "BDIX & Intl", description: "Local or international routing — your choice." },
      ]}
      faqTitle="Managed VPS questions"
      ctaTitle="Let us run your server"
      ctaSubtitle="Move to a managed VPS and never worry about uptime or security again."
      ctaPrimary="Order Managed VPS"
    />
  );
}