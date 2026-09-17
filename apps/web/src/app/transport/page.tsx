import { listTransport, listTrips } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function TransportPage() {
  const trips = listTrips();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Transport</h1>
      {trips.map((t) => (
        <section key={t.id} className="rounded border border-zinc-200 bg-white p-4">
          <h2 className="font-semibold"><a className="underline" href={`/trips/${t.id}`}>{t.title}</a></h2>
          <ul className="mt-2 space-y-1 text-sm">
            {listTransport(t.id).map((l) => (
              <li key={l.id}>{l.mode} {l.provider}: {l.from} → {l.to} ({l.departAt} → {l.arriveAt}, {l.status})</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
