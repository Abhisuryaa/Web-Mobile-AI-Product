import { listTrips, listSchedule } from "@/lib/store";
import Timeline from "@/components/Timeline";

export const dynamic = "force-dynamic";

export default function SchedulesPage() {
  const trips = listTrips();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Schedules</h1>
      {trips.map((t) => (
        <section key={t.id} className="space-y-2">
          <h2 className="font-semibold">
            <a className="underline" href={`/trips/${t.id}`}>{t.title}</a>
          </h2>
          <Timeline items={listSchedule(t.id)} />
        </section>
      ))}
    </div>
  );
}
