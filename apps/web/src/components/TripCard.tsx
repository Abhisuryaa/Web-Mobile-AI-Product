import Link from "next/link";
import type { Trip } from "@/lib/types";
import { formatDate, formatMoney } from "@/lib/format";

export default function TripCard({ trip }: { trip: Trip }) {
  return (
    <Link
      href={`/trips/${trip.id}`}
      className="block min-w-0 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex min-w-0 items-center justify-between gap-3">
        <h3 className="min-w-0 truncate font-semibold text-stone-900">{trip.title}</h3>
        <span className="shrink-0 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
          {trip.status.replace("_", " ")}
        </span>
      </div>
      <p className="mt-1 truncate text-sm text-stone-600">{trip.destination}</p>
      <p className="tnum mt-1 text-xs text-stone-500">
        {formatDate(trip.startDate)} → {formatDate(trip.endDate)} · {formatMoney(trip.budget)}
      </p>
    </Link>
  );
}
