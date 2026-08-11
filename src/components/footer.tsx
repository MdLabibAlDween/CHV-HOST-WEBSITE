import Link from "next/link";
import { Logo } from "@/components/logo";
import { Icon, type IconName } from "@/components/icons";
import { getPublicEnv } from "@/lib/env";
import { loadSiteContent } from "@/lib/site-config";

const SOCIAL_ICONS: Record<string, IconName> = {
  facebook: "facebook",
  x: "twitter",
  linkedin: "linkedin",
  youtube: "youtube",
};

const SERVICE_LINKS = [
  { label: "Web Hosting", href: "/hosting" },
  { label: "BDIX Hosting", href: "/bdix-hosting" },
  { label: "Turbo Hosting", href: "/turbo-hosting" },
  { label: "Reseller Hosting", href: "/reseller-hosting" },
  { label: "VPS", href: "/vps" },
  { label: "BDIX VPS", href: "/bdix-vps" },
];

const DOMAIN_LINKS = [
  { label: "Domain Search", href: "/domains" },
  { label: "Domain Registration", href: "/domains" },
  { label: "Domain Transfer", href: "/domains" },
  { label: "Domain Pricing", href: "/domains" },
];

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Support", href: "/support" },
  { label: "FAQ", href: "/faq" },
  { label: "System Status", href: "/status" },
];

const LEGAL_LINKS = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Acceptable Use Policy", href: "/terms" },
];

export function Footer() {
  const env = getPublicEnv();
  const content = loadSiteContent();

  const footerNav: { title: string; links: { label: string; href: string }[] }[] = [
    { title: "Services", links: SERVICE_LINKS },
    { title: "Domains", links: DOMAIN_LINKS },
    { title: "Company", links: COMPANY_LINKS },
    { title: "Legal", links: LEGAL_LINKS },
  ];

  const clientAreaUrl = env.whmcsUrl
    ? `${env.whmcsUrl.replace(/\/$/, "")}/clientarea.php`
    : "/client-area";

  return (
    <footer className="border-t border-white/10 bg-ink text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Logo light />
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              {content.footer.description}
            </p>
            <div className="mt-5 space-y-2 text-sm">
              <a
                href={`mailto:${env.supportEmail}`}
                className="flex items-center gap-2 text-ink-soft transition-colors hover:text-white"
              >
                <Icon name="mail" size={15} />
                {env.supportEmail}
              </a>
              <a
                href={`tel:${env.supportPhone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-ink-soft transition-colors hover:text-white"
              >
                <Icon name="phone" size={15} />
                {env.supportPhone}
              </a>
            </div>
            <div className="mt-5 flex gap-3">
              {content.footer.socials.map((social) => {
                const icon = SOCIAL_ICONS[social.label.toLowerCase()] ?? "globe";
                return (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-ink-soft transition-colors hover:border-white/30 hover:text-white"
                  >
                    <Icon name={icon} size={17} />
                  </a>
                );
              })}
            </div>
          </div>

          {footerNav.map((column) => (
            <nav key={column.title} aria-label={`${column.title} links`}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-ink-soft transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
                {column.title === "Company" && (
                  <li>
                    <a href={clientAreaUrl} className="text-ink-soft transition-colors hover:text-white">
                      Client Area
                    </a>
                  </li>
                )}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-ink-soft sm:flex-row">
          <p>
            © {new Date().getFullYear()} {env.siteName}. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            <Icon name="activity" size={13} />
            <Link href="/status" className="hover:text-white">
              All systems operational
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
