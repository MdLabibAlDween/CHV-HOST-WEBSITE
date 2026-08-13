import type { Metadata } from "next";
import Link from "next/link";
import { getTlds } from "@/lib/domain";
import { PageHeader } from "@/components/page-header";
import { DomainSearch } from "@/components/domain-search";
import { SectionHeading } from "@/components/section-heading";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Domain Registration",
  description:
    "Search and register domains at the best prices in Bangladesh. .com, .bd, .net and 40+ extensions with transparent renewal pricing.",
};

export default function DomainsPage() {
  const tlds = getTlds();

  return (
    <>
      <PageHeader
        eyebrow="Domains"
        title="Your idea deserves the perfect address"
        subtitle="Search availability across 40+ extensions with clear, honest pricing — registration, renewal and transfer fees shown upfront."
        crumb="Domains"
      />

      <section className="bg-white py-14 dark:bg-transparent">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <DomainSearch />
        </div>
      </section>

      {/* TLD pricing table */}
      <section className="border-y border-border-soft bg-slate-50 py-16 dark:border-white/10 dark:bg-white/5" aria-labelledby="tld-pricing">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Domain pricing"
            title="Transparent prices, no surprises"
            subtitle="The price shown at search is the price you pay. Renewal and transfer fees are published for every extension."
          />
          <div className="mt-10 overflow-x-auto rounded-2xl border border-border-soft bg-card shadow-sm dark:border-white/10">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border-soft bg-slate-50 text-left dark:border-white/10 dark:bg-white/5">
                  <th scope="col" className="px-5 py-3.5 font-semibold text-slate-700 dark:text-slate-300">Extension</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-slate-700 dark:text-slate-300">Register</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-slate-700 dark:text-slate-300">Renew</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-slate-700 dark:text-slate-300">Transfer</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-slate-700 dark:text-slate-300">Min years</th>
                </tr>
              </thead>
              <tbody>
                {tlds.map((tld) => (
                  <tr key={tld.tld} className="border-b border-border-soft last:border-0 hover:bg-slate-50/60 dark:border-white/10 dark:hover:bg-white/10">
                    <td className="px-5 py-3 font-bold text-slate-900 dark:text-slate-100">
                      {tld.tld}
                      {tld.premium && (
                        <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700">
                          Local TLD
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-slate-700 dark:text-slate-300">৳{tld.registerBdt.toLocaleString()}</td>
                    <td className="px-5 py-3 text-slate-700 dark:text-slate-300">৳{tld.renewBdt.toLocaleString()}</td>
                    <td className="px-5 py-3 text-slate-700 dark:text-slate-300">৳{tld.transferBdt.toLocaleString()}</td>
                    <td className="px-5 py-3 text-slate-700 dark:text-slate-300">{tld.minYears} yr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-center text-xs text-muted">
            Prices in BDT for 1 year. USD pricing available at checkout. Final prices are confirmed
            by our billing system.
          </p>
        </div>
      </section>

      {/* Domain + hosting upsell */}
      <section className="bg-white py-16 dark:bg-transparent">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="rounded-3xl border border-border-soft bg-gradient-to-br from-slate-50 to-white p-8 shadow-sm sm:p-10 dark:border-white/10 dark:from-white/5 dark:to-transparent">
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-xl">
                <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-slate-100">
                  <Icon name="sparkles" size={22} className="text-primary" />
                  Save when you bundle
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                  Register your domain and add hosting in one order. Bundle deals include a free
                  .com with annual web hosting, free SSL and a free migration if you already have a
                  site elsewhere.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/hosting"
                  className="btn-gradient inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold"
                >
                  Domain + Hosting
                  <Icon name="arrow-right" size={16} />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-soft px-6 py-3 text-sm font-semibold text-slate-700 hover:border-primary/40 hover:text-primary dark:border-white/10 dark:text-slate-300"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Domain management through WHMCS */}
      <section className="border-t border-border-soft bg-slate-50 py-14 dark:border-white/10 dark:bg-white/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Manage everything in one place</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Once your domain is registered, manage it entirely from your client area: renewals,
                nameservers, DNS, WHOIS details and domain locking — no separate registrar account
                needed.
              </p>
            </div>
            <ul className="space-y-3">
              {[
                "Renew domains before they expire",
                "Transfer existing domains to us",
                "Update nameservers and DNS records",
                "Enable domain locking for security",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <Icon name="check-circle" size={17} className="mt-0.5 shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
