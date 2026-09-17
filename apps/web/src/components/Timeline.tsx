import type { ScheduleItem } from "@/lib/types";

export default function Timeline({ items }: { items: ScheduleItem[] }) {
  if (items.length === 0) return <p className="text-sm text-zinc-500">No schedule items.</p>;
  return (
    <ol className="relative ml-2 border-l border-zinc-200 pl-4">
      {items.map((s) => (
        <li key={s.id} className="mb-4">
          <div className="text-xs text-zinc-500">
            {s.startTime} → {s.endTime} · {s.kind} · {s.status}
          </div>
          <div className="font-medium">{s.title}</div>
          <div className="text-sm text-zinc-600">
            {s.location} — {s.description}
          </div>
        </li>
      ))}
    </ol>
  );
}
