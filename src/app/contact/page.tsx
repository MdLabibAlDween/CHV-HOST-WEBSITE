import type { Metadata } from "next";
import { loadSiteContent } from "@/lib/site-config";
import { getPublicEnv } from "@/lib/env";
import { PageHeader } from "@/components/page-header";
import { ContactForm } from "@/components/contact-form";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact CHV HOST — 24/7 phone and email support for hosting, domains, billing and everything in between.",
};

export default function ContactPage() {
  const env = getPublicEnv();
  const content = loadSiteContent();

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={content.contact.title}
        subtitle={content.contact.description}
        crumb="Contact"
      />

      <section className="bg-white py-16 sm:py-20 dark:bg-transparent">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
          <div className="space-y-4">
            <a
              href={`tel:${env.supportPhone.replace(/\s/g, "")}`}
              className="flex items-start gap-4 rounded-2xl border border-border-soft bg-card p-6 transition-colors hover:border-primary/30 dark:border-white/10"
            >
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl btn-gradient text-white">
                <Icon name="phone" size={20} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">{content.contact.phoneLabel}</h2>
                <p className="mt-1 text-sm text-muted">{env.supportPhone}</p>
                <p className="mt-1 text-xs text-muted">24/7 — sales, billing and support</p>
              </div>
            </a>
            <a
              href={`mailto:${env.supportEmail}`}
              className="flex items-start gap-4 rounded-2xl border border-border-soft bg-card p-6 transition-colors hover:border-primary/30 dark:border-white/10"
            >
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl btn-gradient text-white">
                <Icon name="mail" size={20} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">{content.contact.emailLabel}</h2>
                <p className="mt-1 text-sm text-muted">{env.supportEmail}</p>
                <p className="mt-1 text-xs text-muted">Replies within a few hours</p>
              </div>
            </a>
            <div className="flex items-start gap-4 rounded-2xl border border-border-soft bg-card p-6 dark:border-white/10">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl btn-gradient text-white">
                <Icon name="pin" size={20} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Office</h2>
                <p className="mt-1 text-sm text-muted">{env.companyAddress}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border-soft bg-slate-50/60 p-6 sm:p-8 dark:border-white/10 dark:bg-white/10">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
