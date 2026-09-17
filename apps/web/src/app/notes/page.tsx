import { listNotes, listTrips } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function NotesPage() {
  const trips = listTrips();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Notes</h1>
      {trips.map((t) => (
        <section key={t.id} className="rounded border border-zinc-200 bg-white p-4">
          <h2 className="font-semibold"><a className="underline" href={`/trips/${t.id}`}>{t.title}</a></h2>
          <ul className="mt-2 space-y-1 text-sm">
            {listNotes(t.id).map((n) => (
              <li key={n.id}><strong>{n.title}</strong> by {n.author}: {n.body}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
