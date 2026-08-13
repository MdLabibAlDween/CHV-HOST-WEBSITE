interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  dark?: boolean;
}

export function SectionHeading({ eyebrow, title, subtitle, align = "center", dark = false }: SectionHeadingProps) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : "text-left"}`}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
      )}
      <h2
        className={`mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl ${
          dark ? "text-white" : "text-slate-900 dark:text-slate-100"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${dark ? "text-ink-soft" : "text-muted dark:text-slate-400"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
