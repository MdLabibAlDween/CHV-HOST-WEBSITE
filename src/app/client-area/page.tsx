import type { Metadata } from "next";
import { whmcsClientAreaUrl } from "@/lib/whmcs";
import { PageHeader } from "@/components/page-header";
import { SectionHeading } from "@/components/section-heading";
import { Icon, type IconName } from "@/components/icons";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Client Area",
  description:
    "Log in to manage your hosting, domains, invoices and support tickets in one place.",
};

const ACTIONS: { icon: IconName; title: string; description: string; href: string }[] = [
  { icon: "folder", title: "My Services", description: "Manage your hosting and VPS services.", href: "clientarea.php?action=products" },
  { icon: "globe-2", title: "My Domains", description: "Renewals, nameservers and DNS.", href: "clientarea.php?action=domains" },
  { icon: "document", title: "Invoices", description: "View and pay invoices securely.", href: "clientarea.php?action=invoices" },
  { icon: "ticket", title: "Support Tickets", description: "Open or track support requests.", href: "submitticket.php" },
  { icon: "credit-card", title: "Billing Details", description: "Update payment methods and addresses.", href: "clientarea.php?action=details" },
  { icon: "key", title: "Security", description: "Password, 2FA and login security.", href: "clientarea.php?action=security" },
];

export default function ClientAreaPage() {
  const base = whmcsClientAreaUrl();

  return (
    <>
      <PageHeader
        eyebrow="Client Area"
        title="Everything you manage, in one place"
        subtitle="Orders, services, domains, invoices and support tickets — all handled through our secure billing system."
        crumb="Client Area"
      />

      <section className="bg-white pb-16 pt-4 sm:pb-20 sm:pt-6 dark:bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {base ? (
            <div className="mx-auto max-w-3xl rounded-3xl border border-border-soft bg-card p-8 text-center shadow-sm sm:p-12 dark:border-white/10">
              <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon name="user" size={26} />
              </span>
              <h2 className="mt-5 text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-slate-100">
                Welcome back
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
                Log in to manage your services, pay invoices, open tickets and control your
                domains. New here? Create an account in seconds.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={`${base}clientarea.php`}
                  className="btn-gradient inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold"
                >
                  <Icon name="user" size={16} />
                  Login to Client Area
                </a>
                <a
                  href={`${base}register.php`}
                  className="inline-flex items-center gap-2 rounded-xl border border-border-soft px-7 py-3.5 text-sm font-semibold text-slate-700 hover:border-primary/40 hover:text-primary dark:border-white/10 dark:text-slate-300"
                >
                  Create Account
                </a>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl rounded-3xl border border-border-soft bg-card p-8 text-center shadow-sm sm:p-12 dark:border-white/10">
              <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                <Icon name="warning" size={26} />
              </span>
              <h2 className="mt-5 text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-slate-100">
                Client area coming soon
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
                Our billing system is being prepared. Until then, contact our team and we&apos;ll
                take care of everything for you.
              </p>
              <div className="mt-8 flex justify-center">
                <Link
                  href="/contact"
                  className="btn-gradient inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold"
                >
                  <Icon name="mail" size={16} />
                  Contact Us
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {base && (
        <section className="border-y border-border-soft bg-slate-50 py-16 dark:border-white/10 dark:bg-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Quick access"
              title="Manage everything from here"
              subtitle="One login gives you control of all the essentials."
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ACTIONS.map((action) => (
                <a
                  key={action.title}
                  href={`${base}${action.href}`}
                  className="group rounded-2xl border border-border-soft bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-slate-900/5 dark:border-white/10 dark:hover:shadow-black/30"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl btn-gradient text-white shadow-sm">
                    <Icon name={action.icon} size={22} />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100">{action.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{action.description}</p>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Open
                    <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-1" />
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}