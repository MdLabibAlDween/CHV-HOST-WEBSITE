import type { Metadata } from "next";
import { fetchTlds } from "@/lib/domain";
import { PageHeader } from "@/components/page-header";
import { DomainSearch } from "@/components/domain-search";
import { SectionHeading } from "@/components/section-heading";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Domain Registration",
  description:
    "Search and register domains at the best prices in Bangladesh. .com, .bd, .net and 40+ extensions with transparent renewal pricing.",
};

export default async function DomainsPage() {
  const { tlds } = await fetchTlds();

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
          <div className="mt-10 hidden overflow-x-auto rounded-2xl border border-border-soft bg-card shadow-sm md:block dark:border-white/10">
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
          <div className="mt-10 space-y-3 md:hidden">
            {tlds.map((tld) => (
              <div key={tld.tld} className="rounded-2xl border border-border-soft bg-card p-4 shadow-sm dark:border-white/10">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {tld.tld}
                    {tld.premium && (
                      <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700">
                        Local TLD
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted">{tld.minYears} yr min</p>
                </div>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-slate-50 py-2 dark:bg-white/5">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted">Register</dt>
                    <dd className="mt-0.5 text-sm font-bold text-slate-900 dark:text-slate-100">৳{tld.registerBdt.toLocaleString()}</dd>
                  </div>
                  <div className="rounded-lg bg-slate-50 py-2 dark:bg-white/5">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted">Renew</dt>
                    <dd className="mt-0.5 text-sm font-bold text-slate-900 dark:text-slate-100">৳{tld.renewBdt.toLocaleString()}</dd>
                  </div>
                  <div className="rounded-lg bg-slate-50 py-2 dark:bg-white/5">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted">Transfer</dt>
                    <dd className="mt-0.5 text-sm font-bold text-slate-900 dark:text-slate-100">৳{tld.transferBdt.toLocaleString()}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-muted">
            Prices in BDT for 1 year. USD pricing available at checkout. Final prices are confirmed
            by our billing system.
          </p>
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
