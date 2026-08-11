import { Icon } from "@/components/icons";
import type { StatusName } from "@/lib/site-types";

const STATUS_META: Record<StatusName, { label: string; dot: string; badge: string }> = {
  operational: {
    label: "Operational",
    dot: "bg-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  degraded: {
    label: "Degraded",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  down: {
    label: "Down",
    dot: "bg-rose-500",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
  },
  maintenance: {
    label: "Maintenance",
    dot: "bg-sky-400",
    badge: "bg-sky-50 text-sky-700 border-sky-200",
  },
};

export function StatusCard({
  name,
  status,
  note,
}: {
  name: string;
  status: StatusName;
  note: string;
}) {
  const meta = STATUS_META[status];
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-border-soft bg-white p-5">
      <div className="flex items-start gap-3.5">
        <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${meta.dot}`} aria-hidden="true" />
        <div>
          <h3 className="text-sm font-bold text-slate-900">{name}</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted">{note}</p>
        </div>
      </div>
      <span
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${meta.badge}`}
      >
        <Icon name="activity" size={13} />
        {meta.label}
      </span>
    </div>
  );
}
