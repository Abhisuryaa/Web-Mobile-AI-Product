"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { IconPlane } from "@/components/icons";

const BER_LAT = 52.52;
const BER_LON = 13.405;
const RANGE_NM = 80;
const COS_LAT = 0.6088; // cos(52.52°)
const POLL_MS = 20000;

interface Aircraft {
  callsign: string;
  reg: string;
  type: string;
  altFt: number;
  speedKt: number;
  heading: number;
  lat: number | null;
  lon: number | null;
}

export default function SkyRadar() {
  const scopeRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(0);
  const [fleet, setFleet] = useState<Aircraft[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = scopeRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize(el.clientWidth));
    ro.observe(el);
    setSize(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const fetchFleet = useCallback(async (): Promise<Aircraft[]> => {
    const res = await fetch("/api/live/flights");
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    return ((data.aircraft ?? []) as Aircraft[]).filter(
      (a) => typeof a.lat === "number" && typeof a.lon === "number",
    );
  }, []);

  const syncFleet = useCallback((list: Aircraft[]) => {
    setFleet(list);
    setFailed(false);
    setSelected((prev) =>
      prev && list.some((a) => a.callsign === prev) ? prev : (list[0]?.callsign ?? null),
    );
  }, []);

  const failFleet = useCallback(() => setFailed(true), []);

  useEffect(() => {
    let cancelled = false;
    const pull = () => {
      fetchFleet()
        .then((list) => {
          if (!cancelled) syncFleet(list);
        })
        .catch(() => {
          if (!cancelled) failFleet();
        });
    };
    pull();
    const id = setInterval(() => {
      if (document.visibilityState === "visible" && !cancelled) pull();
    }, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [fetchFleet, syncFleet, failFleet]);

  const half = size / 2;
  const pxPerNm = half > 0 ? (half - 16) / RANGE_NM : 0;
  const plotted = (fleet ?? [])
    .map((a) => {
      const x = ((a.lon ?? 0) - BER_LON) * 60 * COS_LAT * pxPerNm;
      const y = -(((a.lat ?? 0) - BER_LAT) * 60 * pxPerNm);
      return { a, x, y };
    })
    .filter((p) => Math.abs(p.x) <= half && Math.abs(p.y) <= half);

  const tracked = plotted.find((p) => p.a.callsign === selected)?.a ?? null;

  return (
    <div className="rounded-3xl border border-white/8 bg-ink-950 p-6" role="region" aria-label="Live air traffic radar over Berlin">
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex min-w-0 items-center gap-2 text-[15px] font-semibold text-parchment">
          <IconPlane className="size-4 shrink-0 text-gold-300" />
          <span className="truncate">Sky scope · Berlin 80 NM</span>
        </h3>
        <a
          href="https://adsb.lol"
          target="_blank"
          rel="noreferrer"
          className="shrink-0 text-xs text-mist transition-colors hover:text-gold-300"
        >
          via adsb.lol
        </a>
      </div>

      <div
        ref={scopeRef}
        className="relative mx-auto mt-5 aspect-square w-full max-w-[520px] overflow-hidden rounded-full border border-emerald-300/15 bg-[#070d0a]"
      >
        <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" className="absolute inset-0 h-full w-full">
          {[25, 50, 75, 100].map((r) => (
            <circle key={r} cx="50" cy="50" r={r / 2} fill="none" stroke="#4ADE80" strokeOpacity="0.14" strokeWidth="0.25" />
          ))}
          <line x1="50" y1="0" x2="50" y2="100" stroke="#4ADE80" strokeOpacity="0.1" strokeWidth="0.25" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#4ADE80" strokeOpacity="0.1" strokeWidth="0.25" />
          <text x="50" y="7.5" textAnchor="middle" fontSize="3" fill="#4ADE80" fillOpacity="0.55" fontFamily="monospace">80</text>
          <text x="50" y="32" textAnchor="middle" fontSize="3" fill="#4ADE80" fillOpacity="0.45" fontFamily="monospace">40</text>
          <g>
            <rect x="48.7" y="48.7" width="2.6" height="2.6" fill="none" stroke="#E9C86A" strokeWidth="0.4" transform="rotate(45 50 50)" />
            <text x="50" y="55.5" textAnchor="middle" fontSize="3.4" fill="#E9C86A" fontFamily="monospace">BER</text>
          </g>
        </svg>
        <div
          aria-hidden="true"
          className="radar-sweep pointer-events-none absolute inset-0 rounded-full"
          style={{ background: "conic-gradient(from 0deg, rgba(74,222,128,0.28), transparent 22%)" }}
        />

        {fleet === null && !failed && (
          <p className="absolute inset-0 grid place-items-center text-sm text-mist">Tuning the receiver…</p>
        )}
        {failed && (
          <div className="absolute inset-0 grid place-items-center p-8 text-center">
            <div>
              <p className="text-sm text-parchment">Sky feed unreachable right now.</p>
              <button
                type="button"
                onClick={() => {
                  fetchFleet().then(syncFleet).catch(failFleet);
                }}
                className="mt-3 cursor-pointer touch-manipulation rounded-full border border-white/15 px-4 py-2 text-[13px] text-parchment transition-colors hover:border-gold-300/60 hover:text-gold-300"
              >
                Retry feed
              </button>
            </div>
          </div>
        )}

        {plotted.map(({ a, x, y }) => {
          const active = a.callsign === selected;
          return (
            <button
              key={a.callsign}
              type="button"
              onClick={() => setSelected(a.callsign)}
              aria-label={`Track ${a.callsign}, ${a.type}, flight level ${Math.round(a.altFt / 100)}`}
              aria-pressed={active}
              className="blip group absolute top-1/2 left-1/2 cursor-pointer touch-manipulation rounded-md p-1"
              style={{ "--dx": `${x.toFixed(1)}px`, "--dy": `${y.toFixed(1)}px` } as CSSProperties}
            >
              <span className="flex flex-col items-center">
                <svg
                  viewBox="0 0 24 24"
                  fill={active ? "#E9C86A" : "#4ADE80"}
                  aria-hidden="true"
                  className="size-3.5 drop-shadow-[0_0_6px_rgba(74,222,128,0.8)] transition-colors"
                  style={{ transform: `rotate(${a.heading}deg)` }}
                >
                  <path d="M12 1.5 15.5 13l3.5 2v2.2L12 15l-7 2.2V15l3.5-2Z" />
                </svg>
                <span
                  className={`tnum mt-0.5 rounded px-1 font-mono text-[9px] leading-tight whitespace-nowrap transition-colors ${
                    active ? "bg-gold-500/25 text-gold-300" : "bg-black/55 text-emerald-200/75 group-hover:text-emerald-100"
                  }`}
                >
                  {a.callsign}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="tnum mt-4 flex min-h-11 flex-wrap items-center gap-x-5 gap-y-1 rounded-2xl bg-white/[0.03] px-4 py-2.5 text-[13px]" aria-live="polite">
        {tracked ? (
          <>
            <span className="font-semibold tracking-wide text-gold-300">{tracked.callsign}</span>
            <span className="text-mist">{tracked.reg} · {tracked.type}</span>
            <span className="text-parchment">FL{Math.round(tracked.altFt / 100)}</span>
            <span className="text-parchment">{tracked.speedKt > 0 ? `${tracked.speedKt} kt` : "—"}</span>
            <span className="ml-auto text-xs text-mist">
              tracking {plotted.length} aircraft · click any blip
            </span>
          </>
        ) : (
          <span className="text-mist">{fleet === null ? "Waiting for positions…" : "No aircraft in range."}</span>
        )}
      </div>
    </div>
  );
}
