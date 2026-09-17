"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Trip } from "@/lib/types";

export default function AIAssistant() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripId, setTripId] = useState("");
  const [disruption, setDisruption] = useState("Flight strike at BER on Oct 7, possible cancellation");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.trips
      .list()
      .then((t) => {
        setTrips(t);
        if (t.length > 0) setTripId(t[0].id);
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  const run = async (kind: "summarize" | "replan") => {
    if (!tripId) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const data =
        kind === "summarize" ? await api.ai.summarize(tripId) : await api.ai.replan(tripId, disruption);
      setResult(
        typeof data.summary === "string"
          ? `[${data.source}] ${data.summary}`
          : `[${data.source}] ${(data.suggestions as string[]).join("\n")}`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">AI Assistant</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <label className="block text-sm">
        Trip
        <select
          className="mt-1 block w-full rounded border p-2"
          value={tripId}
          onChange={(e) => setTripId(e.target.value)}
        >
          {trips.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        Disruption (for replan)
        <textarea
          className="mt-1 block w-full rounded border p-2"
          rows={3}
          value={disruption}
          onChange={(e) => setDisruption(e.target.value)}
        />
      </label>
      <div className="flex gap-2">
        <button
          className="rounded bg-zinc-900 px-4 py-2 text-sm text-white disabled:opacity-50"
          disabled={loading || !tripId}
          onClick={() => void run("summarize")}
        >
          Summarize itinerary
        </button>
        <button
          className="rounded border border-zinc-900 px-4 py-2 text-sm disabled:opacity-50"
          disabled={loading || !tripId}
          onClick={() => void run("replan")}
        >
          Replan
        </button>
      </div>
      {loading && <p className="text-sm text-zinc-500">Working…</p>}
      {result && (
        <pre className="whitespace-pre-wrap rounded border border-zinc-200 bg-white p-4 text-sm">{result}</pre>
      )}
    </div>
  );
}
