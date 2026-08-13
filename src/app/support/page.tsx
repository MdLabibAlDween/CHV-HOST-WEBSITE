import type { Metadata } from "next";
import { getPublicEnv } from "@/lib/env";
import { PageHeader } from "@/components/page-header";
import { FAQAccordion } from "@/components/faq-accordion";
import { loadSiteContent } from "@/lib/site-config";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with hosting, domains, billing and more — live chat, tickets and email support around the clock.",
};

export default function SupportPage() {
  const env = getPublicEnv();
  const content = loadSiteContent();

  const channels = [
    {
      icon: "life-buoy" as const,
      title: "Support Tickets",
      description: "Detailed issues with attachments — we reply within a few hours.",
      href: env.whmcsUrl ? `${env.whmcsUrl.replace(/\/$/, "")}/submitticket.php` : "/contact",
      cta: "Open a Ticket",
    },
    {
      icon: "mail" as const,
      title: "Email",
      description: "Prefer email? Reach us directly for any question.",
      href: `mailto:${env.supportEmail}`,
      cta: env.supportEmail,
    },
    {
      icon: "phone" as const,
      title: "Phone",
      description: "Talk to a real person — sales, billing or technical support.",
      href: `tel:${env.supportPhone.replace(/\s/g, "")}`,
      cta: env.supportPhone,
    },
    {
      icon: "headphones" as const,
      title: "Live Chat",
      description: "Instant answers during business hours on the homepage.",
      href: env.liveChatProviderUrl || "/contact",
      cta: env.liveChatProviderUrl ? "Start Chatting" : "Chat opens with our live chat provider",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Support"
        title="We're here 24/7"
        subtitle="Whatever you need — account, billing, technical help — reach us through the channel that suits you best."
        crumb="Support"
      />

      <section className="bg-white py-16 dark:bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((channel) => (
              <a
                key={channel.title}
                href={channel.href}
                className="group rounded-2xl border border-border-soft bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-slate-900/5 dark:border-white/10 dark:hover:shadow-black/30"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl btn-gradient text-white">
                  <Icon name={channel.icon} size={22} />
                </span>
                <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100">{channel.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{channel.description}</p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  {channel.cta}
                  <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-1" />
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border-soft bg-slate-50 py-16 dark:border-white/10 dark:bg-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-slate-100">
            Common questions
          </h2>
          <div className="mt-10">
            <FAQAccordion items={content.faqs.slice(0, 4)} />
          </div>
        </div>
      </section>
    </>
  );
}
