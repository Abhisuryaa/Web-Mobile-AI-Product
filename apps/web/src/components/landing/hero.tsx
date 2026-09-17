import Link from "next/link";
import type { Trip, TripUpdate } from "@/lib/types";
import { formatCount, formatDate } from "@/lib/format";
import { IconArrow, IconPhone } from "@/components/icons";
import Reveal from "@/components/landing/Reveal";

/** Signature: great-circle route arcs over a dotted ops grid. Pure SVG + CSS. */
export function RouteArc() {
  return (
    <svg
      viewBox="0 0 1200 560"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="arcGlow" cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#C9A227" stopOpacity="0.16" />
          <stop offset="60%" stopColor="#C9A227" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="560" fill="url(#arcGlow)" />
      {Array.from({ length: 12 }).map((_, r) => (
        <line
          key={`h-${r}`}
          x1="0"
          y1={40 + r * 44}
          x2="1200"
          y2={40 + r * 44}
          stroke="#EDE9E3"
          strokeOpacity="0.05"
        />
      ))}
      {Array.from({ length: 22 }).map((_, c) => (
        <line
          key={`v-${c}`}
          x1={30 + c * 54}
          y1="0"
          x2={30 + c * 54}
          y2="560"
          stroke="#EDE9E3"
          strokeOpacity="0.05"
        />
      ))}
      <g className="ambient-drift">
        <path
          d="M120 430 C 320 300, 460 220, 640 250 S 960 320, 1090 180"
          stroke="#C9A227"
          strokeOpacity="0.55"
          strokeWidth="1.6"
          className="route-dash"
        />
        <path
          d="M180 470 C 360 420, 560 380, 760 400 S 980 430, 1060 330"
          stroke="#EDE9E3"
          strokeOpacity="0.22"
          strokeWidth="1.2"
          className="route-dash-slow"
        />
        <path
          d="M640 250 C 700 200, 780 170, 860 165"
          stroke="#E9C86A"
          strokeOpacity="0.35"
          strokeWidth="1.2"
          className="route-dash-slow"
        />
      </g>
      {[
        { x: 120, y: 430, label: "Home base" },
        { x: 640, y: 250, label: "Berlin" },
        { x: 860, y: 165, label: "Tokyo" },
        { x: 1090, y: 180, label: "Osaka" },
      ].map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r="4" fill="#0B0A08" stroke="#E9C86A" strokeWidth="1.6" />
          <circle cx={p.x} cy={p.y} r="9" stroke="#E9C86A" strokeOpacity="0.35" strokeWidth="1" />
        </g>
      ))}
    </svg>
  );
}

const statusTone: Record<string, string> = {
  confirmed: "bg-signal-live/15 text-signal-live",
  planning: "bg-gold-500/15 text-gold-300",
  in_progress: "bg-sky-400/15 text-sky-300",
  completed: "bg-white/10 text-mist",
  cancelled: "bg-signal-crit/15 text-signal-crit",
};

interface HeroProps {
  trips: Trip[];
  travelerCount: number;
  updates: TripUpdate[];
}

export function Hero({ trips, travelerCount, updates }: HeroProps) {
  const live = updates[0];
  return (
    <section className="grain relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-24" aria-labelledby="hero-title">
      <RouteArc />
      <div className="relative mx-auto max-w-6xl px-5">
        <div className="grid items-end gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-1.5 pr-4 pl-1.5 text-[13px] text-mist">
                <span className="relative grid size-6 place-items-center rounded-full bg-signal-live/15 text-signal-live">
                  <span className="live-dot relative size-1.5 rounded-full bg-current" />
                </span>
                Live ops · {formatCount(trips.length)} active trips · {formatCount(travelerCount)} travelers
              </p>
            </Reveal>
            <Reveal delay={90}>
              <h1
                id="hero-title"
                className="font-display mt-6 text-[clamp(2.6rem,6.2vw,4.9rem)] leading-[1.02] font-medium text-parchment"
              >
                Every trip. Every traveler.{" "}
                <span className="text-gold-300 italic">One calm console.</span>
              </h1>
            </Reveal>
            <Reveal delay={170}>
              <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-mist">
                TravelOps AI runs group travel like air-traffic control — schedules, hotels,
                transport, documents &amp; live disruption handling in one place, with a companion
                app in every traveler&rsquo;s pocket.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/console"
                  className="group cursor-pointer touch-manipulation rounded-full bg-gold-500 px-6 py-3 text-[15px] font-semibold text-ink-950 transition-colors duration-200 hover:bg-gold-300"
                >
                  Open the manager console
                  <IconArrow className="ml-2 inline size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="#traveler"
                  className="cursor-pointer touch-manipulation rounded-full border border-white/15 px-6 py-3 text-[15px] font-medium text-parchment transition-colors duration-200 hover:border-gold-300/60 hover:text-gold-300"
                >
                  <IconPhone className="mr-2 inline size-4" />
                  Meet the traveler app
                </Link>
              </div>
            </Reveal>
            <Reveal delay={300}>
              <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
                {[
                  { v: formatCount(travelerCount), l: "travelers tracked" },
                  { v: formatCount(trips.length), l: "live itineraries" },
                  { v: "24/7", l: "disruption watch" },
                ].map((s) => (
                  <div key={s.l}>
                    <dt className="sr-only">{s.l}</dt>
                    <dd className="font-display tnum text-3xl text-parchment">{s.v}</dd>
                    <dd className="mt-1 text-[13px] text-mist">{s.l}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={200} className="min-w-0">
            <div
              className="glass rounded-3xl border border-white/10 p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
              role="region"
              aria-label="Live operations snapshot"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold tracking-[0.16em] text-mist uppercase">
                  Tonight&rsquo;s board
                </p>
                <p className="inline-flex items-center gap-1.5 text-xs text-signal-live">
                  <span className="live-dot relative size-1.5 rounded-full bg-current" /> Live
                </p>
              </div>
              <ul className="mt-4 space-y-3">
                {trips.map((t) => (
                  <li
                    key={t.id}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5 transition-colors duration-200 hover:border-gold-300/30"
                  >
                    <div className="flex min-w-0 items-center justify-between gap-3">
                      <p className="min-w-0 truncate text-sm font-semibold text-parchment">
                        {t.title}
                      </p>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusTone[t.status] ?? "bg-white/10 text-mist"}`}
                      >
                        {t.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-[13px] text-mist">
                      {t.destination} · {formatDate(t.startDate)} → {formatDate(t.endDate)}
                    </p>
                  </li>
                ))}
              </ul>
              {live && (
                <p className="mt-4 truncate rounded-xl bg-gold-500/10 px-3.5 py-2.5 text-[13px] text-gold-300">
                  Latest: {live.message}
                </p>
              )}
              <Link
                href="/console"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-sm font-medium text-parchment transition-colors duration-200 hover:border-gold-300/50 hover:text-gold-300"
              >
                View live board <IconArrow className="size-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Ticker({ updates }: { updates: TripUpdate[] }) {
  const items = updates.length > 0 ? updates : [];
  if (items.length === 0) return null;
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((u) => (
        <span key={`${hidden ? "b-" : ""}${u.id}`} className="flex items-center whitespace-nowrap">
          <span
            className={`mx-5 inline-block size-1.5 rounded-full ${
              u.severity === "critical"
                ? "bg-signal-crit"
                : u.severity === "warning"
                  ? "bg-signal-warn"
                  : "bg-signal-live"
            }`}
          />
          <span className="text-[13px] tracking-wide text-parchment/75 uppercase">
            {u.tripId.replace("trip-", "")}
          </span>
          <span className="ml-2.5 max-w-md truncate text-[13px] text-mist">{u.message}</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="ticker overflow-hidden border-y border-white/8 bg-ink-900/80 py-3" role="marquee" aria-label="Latest trip updates">
      <div className="ticker-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
