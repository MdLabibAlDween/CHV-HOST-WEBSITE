import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";

export const metadata: Metadata = {
  title: "License",
  description:
    "Genuine software licenses — cPanel, Windows Server and more — delivered instantly through our billing system.",
};

export default function LicensePage() {
  return (
    <CategoryPage
      category="license"
      eyebrow="License"
      title="Genuine licenses, instant delivery"
      subtitle="cPanel, Windows Server and other software licenses — legal, fully managed and delivered to your client area."
      crumb="License"
      featuresEyebrow="Why buy licenses from us"
      featuresTitle="Official keys, zero hassle"
      featuresSubtitle="Every license is genuine, tied to your account and ready immediately."
      features={[
        { icon: "check-circle", title: "100% Genuine", description: "Official keys from authorised channels." },
        { icon: "bolt", title: "Instant Delivery", description: "Keys appear in your client area immediately." },
        { icon: "refresh", title: "Auto-Renewals", description: "Never lose service — renewals handled." },
        { icon: "shield", title: "Managed Billing", description: "One place for all your software invoices." },
        { icon: "headphones", title: "Support Included", description: "Help with activation and setup." },
        { icon: "database", title: "One Dashboard", description: "Manage every license from your account." },
        { icon: "lock", title: "Safe & Legal", description: "Compliant licensing, no grey-market keys." },
        { icon: "activity", title: "Flexible Plans", description: "Monthly or annual billing to suit you." },
      ]}
      faqTitle="License questions"
      ctaTitle="License your software the easy way"
      ctaSubtitle="Browse licenses, pay online and get your key instantly."
      ctaPrimary="Order License"
    />
  );
}