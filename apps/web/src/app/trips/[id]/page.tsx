"use client";

import { use, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Trip } from "@/lib/types";
import Timeline from "@/components/Timeline";

type AnyRow = Record<string, string>;

const sections = [
  { key: "participants", label: "Participants", fields: ["name", "email", "role"] },
  { key: "schedule", label: "Schedule", fields: ["title", "location", "startTime", "endTime", "kind"] },
  { key: "hotels", label: "Hotels", fields: ["name", "address", "checkIn", "checkOut"] },
  { key: "transport", label: "Transport", fields: ["mode", "provider", "from", "to", "departAt", "arriveAt"] },
  { key: "documents", label: "Documents", fields: ["name", "type", "url"] },
  { key: "contacts", label: "Contacts", fields: ["name", "organization", "email", "phone"] },
  { key: "notes", label: "Notes", fields: ["author", "title", "body"] },
] as const;

function Section({ tripId, resource, fields }: { tripId: string; resource: string; fields: readonly string[] }) {
  const [rows, setRows] = useState<AnyRow[]>([]);
  const [form, setForm] = useState<AnyRow>({});
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .byTrip(tripId, resource)
      .then((data) => {
        if (!cancelled) setRows(data);
      })
      .catch((e: unknown) => {
        if (!cancelled) setErr(e instanceof Error ? e.message : String(e));
      });
    return () => {
      cancelled = true;
    };
  }, [tripId, resource]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      await api.addByTrip(tripId, resource, form);
      setForm({});
      const data = await api.byTrip(tripId, resource);
      setRows(data);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : String(e2));
    }
  };

  return (
    <div className="rounded border border-zinc-200 bg-white p-4">
      {err && <p className="mb-2 text-sm text-red-600">{err}</p>}
      {resource === "schedule" ? (
        <Timeline
          items={rows.map((r, i) => ({
            id: r.id ?? `${resource}-row-${i}`,
            tripId,
            title: r.title ?? "",
            description: r.description ?? "",
            location: r.location ?? "",
            startTime: r.startTime ?? "",
            endTime: r.endTime ?? "",
            kind: r.kind ?? "",
            status: r.status ?? "",
          }))}
        />
      ) : (
        <ul className="mb-3 space-y-1 text-sm">
          {rows.map((r, i) => (
            <li key={r.id ?? i} className="rounded bg-zinc-50 p-2">
              {fields.map((f) => (r[f] ? `${f}: ${r[f]} ` : "")).join("· ") || JSON.stringify(r)}
            </li>
          ))}
          {rows.length === 0 && <li className="text-zinc-500">No records.</li>}
        </ul>
      )}
      <form onSubmit={submit} className="flex flex-wrap gap-2">
        {fields.map((f) => (
          <input
            key={f}
            className="min-w-32 flex-1 rounded border p-1.5 text-sm"
            placeholder={f}
            value={form[f] ?? ""}
            onChange={(e) => setForm({ ...form, [f]: e.target.value })}
          />
        ))}
        <button className="rounded bg-zinc-900 px-3 py-1.5 text-sm text-white" type="submit">
          Add
        </button>
      </form>
    </div>
  );
}

export default function TripDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.trips
      .get(id)
      .then((data) => {
        if (!cancelled) {
          setTrip(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTrip(null);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <p className="text-sm text-zinc-500">Loading trip {id}…</p>;
  if (trip === null) return <p className="text-sm text-red-600">Trip not found.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{trip.title}</h1>
        <p className="text-sm text-zinc-600">
          {trip.destination} · {trip.startDate} → {trip.endDate} · {trip.status}
        </p>
        <p className="mt-1 text-sm">{trip.description}</p>
      </div>
      {sections.map((s) => (
        <section key={s.key} className="space-y-2">
          <h2 className="font-semibold">{s.label}</h2>
          <Section tripId={id} resource={s.key} fields={s.fields} />
        </section>
      ))}
    </div>
  );
}
