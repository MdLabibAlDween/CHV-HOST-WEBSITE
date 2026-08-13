import type { Metadata } from "next";
import { loadSiteContent } from "@/lib/site-config";
import { getPublicEnv } from "@/lib/env";
import { PageHeader } from "@/components/page-header";
import { StatusCard } from "@/components/status-card";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "System Status",
  description: "Live status of the CHV HOST platform — website, hosting, DNS, client area, payments and support.",
};

export default function StatusPage() {
  const env = getPublicEnv();
  const content = loadSiteContent();
  const allOperational = content.status.items.every((i) => i.status === "operational");

  return (
    <>
      <PageHeader
        eyebrow="Status"
        title={content.status.title}
        subtitle={content.status.description}
        crumb="Status"
      />

      <section className="bg-white py-16 dark:bg-transparent">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div
            className={`mb-8 flex items-center gap-4 rounded-2xl border p-6 ${
              allOperational
                ? "border-emerald-200 bg-emerald-50"
                : "border-amber-200 bg-amber-50"
            }`}
            role="status"
          >
            <span
              className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                allOperational ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
              }`}
            >
              {allOperational ? (
                <Icon name="check-circle" size={22} />
              ) : (
                <Icon name="warning" size={22} />
              )}
            </span>
            <div>
              <p className="text-sm font-extrabold text-slate-900 sm:text-base dark:text-slate-100">
                {allOperational ? "All systems operational" : "Some systems are experiencing issues"}
              </p>
              <p className="mt-0.5 text-xs text-muted sm:text-sm">
                Last checked {new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {content.status.items.map((item) => (
              <StatusCard key={item.name} name={item.name} status={item.status} note={item.note} />
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-border-soft bg-slate-50 p-6 text-sm text-muted dark:border-white/10 dark:bg-white/5">
            <p className="font-semibold text-slate-700 dark:text-slate-300">Need help with an outage?</p>
            <p className="mt-1.5">
              If something isn&apos;t working for you, contact us immediately — we&apos;ll confirm
              whether it&apos;s a known issue.
            </p>
            <a
              href={env.whmcsUrl ? `${env.whmcsUrl.replace(/\/$/, "")}/submitticket.php` : "/contact"}
              className="mt-3 inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              <Icon name="life-buoy" size={16} />
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
