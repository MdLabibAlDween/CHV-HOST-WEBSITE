import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";

export const metadata: Metadata = {
  title: "WordPress Hosting",
  description:
    "WordPress hosting in Bangladesh with LiteSpeed caching, one-click installs, free SSL and daily backups. Plans synced from our billing system.",
};

export default function WordPressHostingPage() {
  return (
    <CategoryPage
      category="wordpress"
      eyebrow="WordPress Hosting"
      title="WordPress that loads in a blink"
      subtitle="Managed WordPress hosting with LiteSpeed Cache, staging and auto-updates — tuned for visitors in Bangladesh."
      crumb="WordPress Hosting"
      featuresEyebrow="Why WordPress hosting"
      featuresTitle="Built for WordPress performance"
      featuresSubtitle="Everything WordPress needs, pre-configured and maintained for you."
      features={[
        { icon: "bolt", title: "LiteSpeed Cache", description: "Built-in caching for 10x faster page loads." },
        { icon: "panel", title: "One-Click Installs", description: "Install WordPress in seconds from cPanel." },
        { icon: "refresh", title: "Auto-Updates", description: "Core, theme and plugin updates handled safely." },
        { icon: "shield", title: "Hardened Security", description: "WAF, malware scanning and free SSL included." },
        { icon: "database", title: "Daily Backups", description: "Restore any day with one click." },
        { icon: "globe", title: "Local BDIX Network", description: "Fast loading for Bangladeshi visitors." },
        { icon: "headphones", title: "WP Experts", description: "WordPress specialists on our support team." },
        { icon: "lock", title: "Staging Sites", description: "Test changes safely before going live." },
      ]}
      faqTitle="WordPress hosting questions"
      ctaTitle="Launch your WordPress site today"
      ctaSubtitle="Migrate your existing WordPress site free — our team handles everything."
      ctaPrimary="Order WordPress Hosting"
    />
  );
}