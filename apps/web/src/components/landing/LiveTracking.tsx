"use client";

import { useCallback, useEffect, useState } from "react";
import { IconRoute } from "@/components/icons";
import Reveal from "@/components/landing/Reveal";
import SkyRadar from "@/components/landing/SkyRadar";

interface Departure {
  line: string;
  operator: string;
  to: string;
  departure: string;
  delayMin: number;
  platform: string;
}

function timeOf(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(d);
}

function SkeletonRows({ n = 5 }: { n?: number }) {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="h-11 animate-pulse rounded-xl bg-white/[0.05]" />
      ))}
    </div>
  );
}

export default function LiveTracking() {
  const [trains, setTrains] = useState<Departure[] | null>(null);
  const [trainsMeta, setTrainsMeta] = useState("");
  const [trainsFailed, setTrainsFailed] = useState(false);
  const [refreshing, setRefreshing] = useState(true);

  const fetchBoard = useCallback(async (): Promise<{ departures: Departure[]; station: string }> => {
    const res = await fetch("/api/live/trains");
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    return { departures: data.departures ?? [], station: data.station ?? "" };
  }, []);

  const syncBoard = useCallback((board: { departures: Departure[]; station: string }) => {
    setTrains(board.departures);
    setTrainsMeta(board.station);
    setTrainsFailed(false);
    setRefreshing(false);
  }, []);

  const failBoard = useCallback(() => {
    setTrainsFailed(true);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const pull = () => {
      fetchBoard()
        .then((board) => {
          if (!cancelled) syncBoard(board);
        })
        .catch(() => {
          if (!cancelled) failBoard();
        });
    };
    pull();
    const id = setInterval(() => {
      if (document.visibilityState === "visible" && !cancelled) pull();
    }, 60000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [fetchBoard, syncBoard, failBoard]);

  return (
    <section id="live" className="scroll-mt-24 border-t border-white/8 bg-ink-900/50" aria-labelledby="live-title">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-gold-300 uppercase">
                Live sky &amp; rails
              </p>
              <h2 id="live-title" className="font-display mt-4 max-w-2xl text-[clamp(1.8rem,3.6vw,2.9rem)] leading-[1.08] font-medium text-parchment">
                The sky above Berlin. The boards at Zürich.
              </h2>
            </div>
            <p className="flex items-center gap-2 text-[13px] text-mist">
              <span className="live-dot relative size-1.5 rounded-full bg-signal-live text-signal-live" />
              {refreshing ? "Refreshing…" : "Radar glides live · boards every minute"}
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid items-start gap-4 lg:grid-cols-2">
          <Reveal>
            <SkyRadar />
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-3xl border border-white/8 bg-ink-950 p-6" role="region" aria-label="Live train departures">
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex min-w-0 items-center gap-2 text-[15px] font-semibold text-parchment">
                  <IconRoute className="size-4 shrink-0 text-gold-300" />
                  <span className="truncate">Departures · {trainsMeta || "Zürich HB"}</span>
                </h3>
                <a
                  href="https://transport.opendata.ch"
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 text-xs text-mist transition-colors hover:text-gold-300"
                >
                  via transport.opendata.ch
                </a>
              </div>
              <div className="mt-4">
                {trains === null && !trainsFailed && <SkeletonRows />}
                {trainsFailed ? (
                  <div className="rounded-2xl border border-white/8 p-5 text-sm">
                    <p className="text-parchment">Rail board unreachable right now.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setRefreshing(true);
                        fetchBoard().then(syncBoard).catch(failBoard);
                      }}
                      className="mt-3 cursor-pointer touch-manipulation rounded-full border border-white/15 px-4 py-2 text-[13px] text-parchment transition-colors hover:border-gold-300/60 hover:text-gold-300"
                    >
                      Retry board
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {(trains ?? []).map((d, i) => (
                      <li
                        key={`${d.line}-${d.departure}-${i}`}
                        className="flex min-w-0 items-center gap-3 rounded-2xl bg-white/[0.03] px-4 py-2.5 transition-colors duration-200 hover:bg-white/[0.06]"
                      >
                        <span className="tnum w-12 shrink-0 text-[15px] font-semibold text-gold-300">
                          {timeOf(d.departure)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-parchment">
                            {d.line} → {d.to}
                          </span>
                          <span className="block truncate text-xs text-mist">
                            Pl. {d.platform}{d.operator ? ` · ${d.operator}` : ""}
                          </span>
                        </span>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                            d.delayMin > 0
                              ? "bg-signal-warn/15 text-signal-warn"
                              : "bg-signal-live/15 text-signal-live"
                          }`}
                        >
                          {d.delayMin > 0 ? `+${d.delayMin} min` : "on time"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={80}>
          <p className="mt-6 text-[13px] leading-relaxed text-mist">
            Public feeds, no keys: community ADS-B receivers overhead, and the open Swiss
            timetable. Blips glide as new positions arrive — the same live-wire pattern the
            traveler app uses for trip updates.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
