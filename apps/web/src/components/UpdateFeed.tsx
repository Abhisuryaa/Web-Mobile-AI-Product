"use client";

import { useEffect, useState } from "react";
import type { TripUpdate } from "@/lib/types";
import { formatDateTime } from "@/lib/format";

function subscribeToStream(
  onUpdate: (u: TripUpdate) => void,
  onLive: (live: boolean) => void,
): () => void {
  let es: EventSource | null = null;
  try {
    es = new EventSource("/api/updates/stream");
    es.addEventListener("update", (ev) => {
      try {
        const data = JSON.parse((ev as MessageEvent).data) as TripUpdate;
        onUpdate(data);
        onLive(true);
      } catch {
        /* ignore malformed event */
      }
    });
    es.onerror = () => onLive(false);
  } catch {
    /* EventSource unavailable — polling fallback covers it */
  }

  const poll = setInterval(() => {
    fetch("/api/updates")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: TripUpdate[]) => {
        if (Array.isArray(data) && data.length > 0) {
          onUpdate(data[0]);
        }
      })
      .catch(() => {
        /* offline */
      });
  }, 10000);

  return () => {
    clearInterval(poll);
    es?.close();
  };
}

export default function UpdateFeed({ initial = [] as TripUpdate[] }: { initial?: TripUpdate[] }) {
  const [updates, setUpdates] = useState<TripUpdate[]>(initial);
  const [live, setLive] = useState(false);

  useEffect(
    () =>
      subscribeToStream(
        (u) => setUpdates((prev) => [u, ...prev].slice(0, 20)),
        (v) => setLive(v),
      ),
    [],
  );

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-stone-900">Realtime updates</h3>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-stone-500">
          <span className={`size-1.5 rounded-full ${live ? "bg-emerald-500" : "bg-stone-300"}`} />
          {live ? "live" : "polling…"}
        </span>
      </div>
      <ul className="space-y-2">
        {updates.map((u) => (
          <li key={`${u.id}-${u.createdAt}`} className="min-w-0 rounded-xl bg-stone-50 p-2.5 text-sm text-stone-800">
            <span
              className={`mr-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                u.severity === "critical"
                  ? "bg-red-100 text-red-700"
                  : u.severity === "warning"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-sky-100 text-sky-800"
              }`}
            >
              {u.severity}
            </span>
            <span className="font-medium">{u.tripId}</span>: {u.message}
            <div className="tnum mt-0.5 text-xs text-stone-500">{formatDateTime(u.createdAt)}</div>
          </li>
        ))}
        {updates.length === 0 && <li className="text-sm text-stone-500">No updates yet.</li>}
      </ul>
    </div>
  );
}
