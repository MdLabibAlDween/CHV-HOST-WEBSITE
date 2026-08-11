import Link from "next/link";
import { Icon } from "@/components/icons";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  crumb,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  crumb: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink py-16 sm:py-20">
      <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
      <div
        className="absolute -top-24 right-1/4 h-64 w-96 rounded-full opacity-20 blur-3xl"
        style={{
          backgroundImage: "linear-gradient(120deg, var(--brand-primary), var(--brand-secondary))",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex items-center gap-1.5 text-xs text-ink-soft">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <Icon name="chevron-right" size={12} />
            </li>
            <li className="font-semibold text-white">{crumb}</li>
          </ol>
        </nav>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
        <h1 className="mt-2 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
