import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";

export const metadata: Metadata = {
  title: "Windows Server RDP",
  description:
    "Windows Server RDP in Bangladesh — high-spec remote desktops with SSD storage, full admin access and instant delivery.",
};

export default function WindowsRdpPage() {
  return (
    <CategoryPage
      category="windows-rdp"
      eyebrow="Windows Server RDP"
      title="Windows Server, on demand"
      subtitle="High-performance Windows remote desktops with SSD storage, admin access and instant delivery — billed simply."
      crumb="Windows Server RDP"
      featuresEyebrow="Why Windows RDP"
      featuresTitle="A full Windows server in your hands"
      featuresSubtitle="Perfect for automation, trading, mining and running Windows-only software."
      features={[
        { icon: "server", title: "Full Admin Access", description: "Complete control of your Windows session." },
        { icon: "database", title: "NVMe SSD Storage", description: "Fast disk I/O for every workload." },
        { icon: "bolt", title: "Instant Delivery", description: "Access details delivered within minutes." },
        { icon: "shield", title: "Secure Sessions", description: "Encrypted RDP with your own credentials." },
        { icon: "cpu", title: "Dedicated Cores", description: "CPU resources you don't share with others." },
        { icon: "clock", title: "24/7 Uptime", description: "Reliable power and network around the clock." },
        { icon: "headphones", title: "Local Support", description: "Setup help from our team in Bangladesh." },
        { icon: "server", title: "Windows Server", description: "Server 2019/2022 with all updates applied." },
      ]}
      faqTitle="Windows RDP questions"
      ctaTitle="Get your Windows RDP running today"
      ctaSubtitle="Order through our billing system and your access details arrive instantly."
      ctaPrimary="Order Windows Server RDP"
    />
  );
}