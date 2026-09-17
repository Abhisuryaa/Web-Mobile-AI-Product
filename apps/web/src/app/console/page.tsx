import Link from "next/link";
import TripCard from "@/components/TripCard";
import UpdateFeed from "@/components/UpdateFeed";
import { formatCount } from "@/lib/format";
import { listParticipants, listTrips, listUpdates } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function ConsoleDashboard() {
  const trips = listTrips();
  const updates = listUpdates(10);
  const travelerCount = trips.reduce((n, t) => n + listParticipants(t.id).length, 0);
  const upcoming = trips.filter((t) => t.status === "confirmed" || t.status === "planning").length;
  const disruptions = updates.filter((u) => u.severity !== "info").length;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-stone-500 uppercase">
            Manager console
          </p>
          <h1 className="font-display mt-1 text-4xl font-medium tracking-tight text-stone-900">
            Tonight&rsquo;s operation
          </h1>
        </div>
        <Link
          href="/trips"
          className="cursor-pointer touch-manipulation rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-stone-700"
        >
          Manage trips
        </Link>
      </div>

      <section aria-label="Key figures" className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Active trips", value: trips.length, hero: true },
          { label: "Travelers", value: travelerCount },
          { label: "Upcoming departures", value: upcoming },
          { label: "Open disruptions", value: disruptions, alert: disruptions > 0 },
        ].map((k) => (
          <div
            key={k.label}
            className={`rounded-2xl border p-5 ${
              k.alert
                ? "border-red-200 bg-red-50"
                : "border-stone-200 bg-white"
            }`}
          >
            <p className={`tnum font-display ${k.hero ? "text-4xl" : "text-3xl"} ${k.alert ? "text-red-700" : "text-stone-900"}`}>
              {formatCount(k.value)}
            </p>
            <p className={`mt-1 text-[13px] ${k.alert ? "text-red-600" : "text-stone-500"}`}>{k.label}</p>
          </div>
        ))}
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <section aria-label="Trips" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-900">Trips</h2>
            <Link href="/trips" className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-900">
              View all
            </Link>
          </div>
          {trips.map((t) => (
            <TripCard key={t.id} trip={t} />
          ))}
          {trips.length === 0 && (
            <p className="rounded-2xl border border-dashed border-stone-300 p-6 text-sm text-stone-500">
              No trips yet. Create the first one to fill this board.
            </p>
          )}
        </section>
        <UpdateFeed initial={updates} />
      </div>
    </div>
  );
}
