"use client";

import { useState } from "react";
import type { Trip } from "@/lib/types";
import { IconSpark } from "@/components/icons";

type Result = { kind: "summary"; text: string; source: string } | { kind: "plan"; lines: string[]; source: string };

export default function AiCommand({ trips }: { trips: Trip[] }) {
  const [tripId, setTripId] = useState(trips[0]?.id ?? "");
  const [disruption, setDisruption] = useState("Flight strike in Berlin on day 2");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState<"summary" | "plan" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(kind: "summary" | "plan") {
    if (!tripId || loading) return;
    setLoading(kind);
    setError(null);
    try {
      const res = await fetch(
        kind === "summary" ? "/api/ai/itinerary-summary" : "/api/ai/replan",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(kind === "summary" ? { tripId } : { tripId, disruption }),
        },
      );
      if (!res.ok) throw new Error(`Server answered ${res.status}`);
      const data = await res.json();
      setResult(
        kind === "summary"
          ? { kind, text: String(data.summary ?? "No summary returned."), source: String(data.source ?? "unknown") }
          : {
              kind,
              lines: Array.isArray(data.suggestions) ? data.suggestions.map(String) : [],
              source: String(data.source ?? "unknown"),
            },
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? `${e.message}. Start the web app with “npm run dev” and try again.`
          : "Request failed. Start the web app with “npm run dev” and try again.",
      );
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-ink-900">
      <div className="flex items-center gap-3 border-b border-white/8 px-5 py-4">
        <span className="grid size-9 place-items-center rounded-full bg-gold-500/15 text-gold-300">
          <IconSpark className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-parchment">Ask TravelOps</p>
          <p className="truncate text-[13px] text-mist">Live demo — wired to this site&rsquo;s API</p>
        </div>
        <span className="ml-auto hidden shrink-0 rounded-full bg-white/6 px-3 py-1 text-xs text-mist sm:block">
          {result ? `source: ${result.source}` : "pick a trip, press run"}
        </span>
      </div>

      <div className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-end">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-1.5">
            <label htmlFor="ai-trip" className="text-[13px] font-medium text-parchment">
              Trip
            </label>
            <select
              id="ai-trip"
              name="trip"
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
              className="cursor-pointer touch-manipulation rounded-xl border border-white/12 bg-ink-800 px-3.5 py-2.5 text-sm text-parchment"
            >
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex min-w-0 flex-col gap-1.5">
            <label htmlFor="ai-disruption" className="text-[13px] font-medium text-parchment">
              Disruption to replan around
            </label>
            <input
              id="ai-disruption"
              name="disruption"
              type="text"
              autoComplete="off"
              spellCheck={false}
              value={disruption}
              onChange={(e) => setDisruption(e.target.value)}
              placeholder="Flight strike on day 2…"
              className="min-w-0 rounded-xl border border-white/12 bg-ink-800 px-3.5 py-2.5 text-sm text-parchment placeholder:text-mist/70"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => run("summary")}
            disabled={loading !== null}
            className="cursor-pointer touch-manipulation rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-ink-950 transition-colors duration-200 hover:bg-gold-300 disabled:cursor-wait disabled:opacity-60"
          >
            {loading === "summary" ? "Summarizing…" : "Summarize itinerary"}
          </button>
          <button
            type="button"
            onClick={() => run("plan")}
            disabled={loading !== null}
            className="cursor-pointer touch-manipulation rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-parchment transition-colors duration-200 hover:border-gold-300/60 hover:text-gold-300 disabled:cursor-wait disabled:opacity-60"
          >
            {loading === "plan" ? "Replanning…" : "Replan disruption"}
          </button>
        </div>
      </div>

      <div className="border-t border-white/8 px-5 py-5" aria-live="polite">
        {error && (
          <p className="rounded-xl bg-signal-crit/10 px-4 py-3 text-sm text-signal-crit">
            {error}
          </p>
        )}
        {!error && !result && (
          <p className="text-sm text-mist">
            The copilot reads the live trip store — schedules, hotels, transport — then answers.
            No mock text; press run.
          </p>
        )}
        {result?.kind === "summary" && (
          <p className="max-h-64 overflow-y-auto whitespace-pre-line text-sm leading-relaxed text-parchment/90">
            {result.text}
          </p>
        )}
        {result?.kind === "plan" && (
          <ol className="max-h-64 space-y-2 overflow-y-auto">
            {result.lines.map((line, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-parchment/90">
                <span className="tnum mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-gold-500/15 text-xs font-semibold text-gold-300">
                  {i + 1}
                </span>
                <span className="min-w-0">{line.replace(/^\d+[.)]\s*/, "")}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
