import Link from "next/link";

export function CTASection({
  title,
  subtitle,
  primaryLabel,
  secondaryLabel,
  primaryHref,
  secondaryHref,
}: {
  title: string;
  subtitle: string;
  primaryLabel: string;
  secondaryLabel: string;
  primaryHref?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink py-20" aria-label="Call to action">
      <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
      <div
        className="absolute -top-32 left-1/2 h-72 w-[36rem] max-w-full -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{
          backgroundImage: "linear-gradient(100deg, var(--brand-primary), var(--brand-secondary))",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-ink-soft sm:text-lg">{subtitle}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={primaryHref ?? "/pricing"}
            className="btn-gradient inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold sm:w-auto"
          >
            {primaryLabel}
          </Link>
          {secondaryLabel && (
            <Link
              href={secondaryHref ?? "/domains"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/40 sm:w-auto"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
