import { Icon } from "@/components/icons";

export function TestimonialCard({
  name,
  company,
  rating,
  text,
}: {
  name: string;
  company: string;
  rating: number;
  text: string;
}) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-border-soft bg-white p-6">
      <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Icon
            key={i}
            name="star"
            size={16}
            className={i < rating ? "text-amber-400" : "text-slate-200"}
            fill={i < rating ? "currentColor" : "none"}
          />
        ))}
      </div>
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">
        &ldquo;{text}&rdquo;
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-border-soft pt-4">
        <span
          className="inline-flex h-10 w-10 items-center justify-center rounded-full btn-gradient text-sm font-bold text-white"
          aria-hidden="true"
        >
          {name.charAt(0)}
        </span>
        <div>
          <p className="text-sm font-bold text-slate-900">{name}</p>
          <p className="text-xs text-muted">{company}</p>
        </div>
      </figcaption>
    </figure>
  );
}
