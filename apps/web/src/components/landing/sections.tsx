import Link from "next/link";
import type { ScheduleItem, Trip, TripUpdate } from "@/lib/types";
import { formatCount, formatDate, formatDateTime, formatMoney } from "@/lib/format";
import {
  IconArrow,
  IconBell,
  IconCalendar,
  IconCheck,
  IconDoc,
  IconPhone,
  IconPlane,
  IconRoute,
  IconSpark,
  IconUsers,
} from "@/components/icons";
import Reveal from "@/components/landing/Reveal";
import AiCommand from "@/components/landing/aicommand";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-[0.22em] text-gold-300 uppercase">{children}</p>
  );
}

function SectionTitle({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className="font-display mt-4 max-w-2xl text-[clamp(1.8rem,3.6vw,2.9rem)] leading-[1.08] font-medium text-parchment">
      {children}
    </h2>
  );
}

/* ---------- Chapter 01 — the problem ---------- */
const pains = [
  {
    icon: IconDoc,
    title: "Documents everywhere",
    body: "Passports in email, visas in chat threads, tickets in a driver’s glovebox. Nobody knows which copy is current.",
  },
  {
    icon: IconBell,
    title: "Silent disruptions",
    body: "A strike, a cancellation, an overbooked hotel — and the news reaches the manager after the travelers do.",
  },
  {
    icon: IconUsers,
    title: "Blind travelers",
    body: "Itineraries frozen in PDFs. One schedule change and thirty people are reading thirty versions of the trip.",
  },
];

export function ChapterProblem() {
  return (
    <section className="scroll-mt-24 border-t border-white/8" aria-labelledby="ch-problem">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <Reveal>
          <Eyebrow>Chapter 01 — The 2 a.m. spreadsheet</Eyebrow>
          <SectionTitle id="ch-problem">Group travel breaks in the same three places.</SectionTitle>
        </Reveal>
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {pains.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 90}>
              <div className="h-full rounded-3xl border border-white/8 bg-white/[0.025] p-6 transition-colors duration-300 hover:border-gold-300/30">
                <span className="grid size-11 place-items-center rounded-2xl bg-white/6 text-gold-300">
                  <p.icon className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-parchment">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-mist">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Chapter 02 — the flow ---------- */
const steps = [
  {
    n: "01",
    title: "Managers plan once",
    body: "Trips, participants, schedules, hotels, transport, documents, contacts, notes — one console, one source of truth.",
  },
  {
    n: "02",
    title: "TravelOps watches always",
    body: "Live updates stream in over SSE. The AI copilot summarizes itineraries and drafts replan steps when reality intrudes.",
  },
  {
    n: "03",
    title: "Travelers just glide",
    body: "The Expo companion carries itinerary, documents and contacts offline. One tap to call the right human, day or night.",
  },
];

export function ChapterFlow() {
  return (
    <section className="scroll-mt-24 border-t border-white/8 bg-ink-900/50" aria-labelledby="ch-flow">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <Reveal>
          <Eyebrow>Chapter 02 — Manager → TravelOps → Traveler</Eyebrow>
          <SectionTitle id="ch-flow">A trip flows downhill. Panic doesn’t flow back up.</SectionTitle>
        </Reveal>
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 90}>
              <div className="relative h-full overflow-hidden rounded-3xl border border-white/8 bg-ink-950 p-6">
                <span aria-hidden="true" className="font-display tnum text-6xl text-white/8">
                  {s.n}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-parchment">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-mist">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Chapter 03 — operations bento ---------- */
interface OpsProps {
  trips: Trip[];
  updates: TripUpdate[];
  travelerCount: number;
}

export function OpsBento({ trips, updates, travelerCount }: OpsProps) {
  return (
    <section id="operations" className="scroll-mt-24 border-t border-white/8" aria-labelledby="ops-title">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <Reveal>
          <Eyebrow>Chapter 03 — The console</Eyebrow>
          <SectionTitle id="ops-title">
            One board for the whole operation. Quiet until it matters.
          </SectionTitle>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-mist">
            {formatCount(trips.length)} live trips · {formatCount(travelerCount)} travelers ·
            every entity below reads from the same API the traveler app uses.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <div className="flex h-full flex-col rounded-3xl border border-white/8 bg-white/[0.025] p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 text-[15px] font-semibold text-parchment">
                  <IconBell className="size-4 text-gold-300" /> Live wire
                </h3>
                <Link href="/updates" className="text-sm text-mist transition-colors hover:text-gold-300">
                  All updates <IconArrow className="inline size-3.5" />
                </Link>
              </div>
              <ul className="mt-4 space-y-2.5">
                {updates.slice(0, 4).map((u) => (
                  <li
                    key={u.id}
                    className="flex min-w-0 items-start gap-3 rounded-2xl bg-white/[0.03] px-4 py-3"
                  >
                    <span
                      className={`mt-1.5 size-2 shrink-0 rounded-full ${
                        u.severity === "critical"
                          ? "bg-signal-crit"
                          : u.severity === "warning"
                            ? "bg-signal-warn"
                            : "bg-signal-live"
                      }`}
                    />
                    <p className="min-w-0 flex-1 truncate text-sm text-parchment/90">{u.message}</p>
                    <span className="tnum shrink-0 text-xs text-mist">{formatDateTime(u.createdAt)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={110}>
            <div className="flex h-full flex-col rounded-3xl border border-gold-300/20 bg-gold-500/[0.07] p-6">
              <h3 className="flex items-center gap-2 text-[15px] font-semibold text-parchment">
                <IconSpark className="size-4 text-gold-300" /> AI copilot
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-mist">
                Summaries and replan drafts generated from live trip data — designed into the
                record, not bolted on as a chat bubble.
              </p>
              <Link
                href="#ai"
                className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-medium text-gold-300 transition-colors hover:text-gold-400"
              >
                Try it live below <IconArrow className="size-4" />
              </Link>
            </div>
          </Reveal>

          {trips.map((t, i) => (
            <Reveal key={t.id} delay={i * 80}>
              <Link
                href={`/trips/${t.id}`}
                className="block h-full rounded-3xl border border-white/8 bg-white/[0.025] p-6 transition-colors duration-300 hover:border-gold-300/30"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="flex min-w-0 items-center gap-2 truncate text-[15px] font-semibold text-parchment">
                    <IconPlane className="size-4 shrink-0 text-gold-300" />
                    <span className="truncate">{t.title}</span>
                  </p>
                </div>
                <p className="mt-1.5 truncate text-sm text-mist">{t.destination}</p>
                <p className="tnum mt-4 text-sm text-parchment/80">
                  {formatMoney(t.budget)} · {formatDate(t.startDate)} → {formatDate(t.endDate)}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-3xl border border-white/8 px-6 py-5 text-sm text-mist">
            {[
              { icon: IconCalendar, label: "Schedules", href: "/schedules" },
              { icon: IconRoute, label: "Transport", href: "/transport" },
              { icon: IconDoc, label: "Documents", href: "/documents" },
              { icon: IconUsers, label: "Contacts", href: "/contacts" },
            ].map((f) => (
              <Link key={f.href} href={f.href} className="flex items-center gap-2 transition-colors hover:text-gold-300">
                <f.icon className="size-4" /> {f.label}
              </Link>
            ))}
            <Link href="/console" className="ml-auto flex items-center gap-2 font-medium text-gold-300 transition-colors hover:text-gold-400">
              Open full console <IconArrow className="size-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- AI demo ---------- */
export function AiSection({ trips }: { trips: Trip[] }) {
  return (
    <section id="ai" className="scroll-mt-24 border-t border-white/8 bg-ink-900/50" aria-labelledby="ai-title">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <Eyebrow>The copilot</Eyebrow>
            <h2 id="ai-title" className="font-display mt-4 text-[clamp(1.8rem,3.6vw,2.9rem)] leading-[1.08] font-medium text-parchment">
              Ask about any trip. Get an operator&rsquo;s answer.
            </h2>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-mist">
              Summaries condense schedules, hotels and transport into a briefing. Replans turn a
              disruption — a strike, a cancellation, an overbooking — into numbered action steps.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-mist">
              {["Reads live trip data, not a cached guess", "Falls back to heuristics without an API key", "Every suggestion links back to a schedule item"].map((li) => (
                <li key={li} className="flex items-start gap-2.5">
                  <IconCheck className="mt-0.5 size-4 shrink-0 text-signal-live" />
                  <span>{li}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <AiCommand trips={trips} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Traveler app ---------- */
interface TravelerProps {
  schedule: ScheduleItem[];
  trip: Trip | undefined;
  docsCount: number;
  contactsCount: number;
}

export function TravelerApp({ schedule, trip, docsCount, contactsCount }: TravelerProps) {
  return (
    <section id="traveler" className="scroll-mt-24 border-t border-white/8" aria-labelledby="traveler-title">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:py-28 lg:grid-cols-2">
        <Reveal>
          <Eyebrow>In every pocket</Eyebrow>
          <h2 id="traveler-title" className="font-display mt-4 text-[clamp(1.8rem,3.6vw,2.9rem)] leading-[1.08] font-medium text-parchment">
            The traveler app: itinerary, documents &amp; help — offline.
          </h2>
          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-mist">
            Built with Expo, shipped through EAS. When the network drops in a arrivals hall, the
            itinerary, documents and emergency contacts are still there.
          </p>
          <dl className="mt-8 grid max-w-md grid-cols-3 gap-4">
            {[
              { v: formatCount(schedule.length), l: "stops synced" },
              { v: formatCount(docsCount), l: "docs offline" },
              { v: formatCount(contactsCount), l: "contacts" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-white/8 p-4">
                <dt className="sr-only">{s.l}</dt>
                <dd className="font-display tnum text-2xl text-gold-300">{s.v}</dd>
                <dd className="mt-1 text-xs text-mist">{s.l}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 rounded-2xl border border-white/8 bg-ink-900 p-5">
            <p className="text-xs font-semibold tracking-[0.16em] text-mist uppercase">Ship it with EAS</p>
            <pre className="tnum rail-scroll mt-3 overflow-x-auto text-[13px] leading-relaxed text-parchment/85">
              <code>{`cd apps/mobile\nnpm install\nnpx expo start         # Expo Go\n\neas build --profile preview\n                            # QA APK\neas build --profile production`}</code>
            </pre>
          </div>
        </Reveal>

        <Reveal delay={140} className="mx-auto w-full max-w-[320px]">
          <div
            className="rounded-[2.6rem] border border-white/12 bg-ink-800 p-2.5 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)]"
            role="img"
            aria-label={`Traveler app preview showing the ${trip?.title ?? "trip"} itinerary`}
          >
            <div className="overflow-hidden rounded-[2rem] bg-ink-950">
              <div className="flex items-center justify-between px-5 pt-5">
                <p className="text-[11px] tracking-[0.18em] text-mist uppercase">Today</p>
                <p className="flex items-center gap-1.5 text-[11px] text-signal-live">
                  <span className="live-dot relative size-1.5 rounded-full bg-current" /> Synced
                </p>
              </div>
              <p className="font-display px-5 pt-1 text-[22px] leading-tight text-parchment">
                {trip?.title ?? "Trip"}
              </p>
              <p className="truncate px-5 text-xs text-mist">{trip?.destination}</p>
              <ul className="space-y-2 px-4 py-4">
                {schedule.slice(0, 4).map((s, i) => (
                  <li key={s.id} className="flex gap-3 rounded-2xl bg-white/[0.04] p-3">
                    <span className="tnum grid size-7 shrink-0 place-items-center rounded-full bg-gold-500/15 text-[11px] font-semibold text-gold-300">
                      {i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-medium text-parchment">{s.title}</span>
                      <span className="block truncate text-[11px] text-mist">
                        {formatDateTime(s.startTime)} · {s.location}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="grid grid-cols-3 gap-2 px-4 pb-6">
                {["Itinerary", "Docs", "Help"].map((t, i) => (
                  <span
                    key={t}
                    className={`rounded-xl py-2 text-center text-[11px] font-medium ${i === 0 ? "bg-gold-500 text-ink-950" : "bg-white/6 text-mist"}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-4 flex items-center justify-center gap-2 text-center text-[13px] text-mist">
            <IconPhone className="size-4" /> Tabs: Itinerary · Schedule · Documents · Contacts · Updates
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Field notes + final CTA ---------- */
export function FieldNotes() {
  return (
    <section className="border-t border-white/8 bg-ink-900/50" aria-labelledby="notes-title">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-24">
        <Reveal>
          <Eyebrow>Field notes — from the demo board</Eyebrow>
          <h2 id="notes-title" className="font-display mt-4 max-w-2xl text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.1] font-medium text-parchment">
            What calm looks like, per trip.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            {
              q: "“Berlin summit, day two: rail strike announced at 6 a.m. Replan drafted by 6:04, travelers rerouted before breakfast.”",
              a: "Berlin AI Summit · warning resolved",
            },
            {
              q: "“Osaka hotel overbooked two rooms. Overflow secured within 2 km, same dates — nobody slept in a lobby.”",
              a: "Tokyo Client Tour · still planning",
            },
          ].map((t, i) => (
            <Reveal key={t.a} delay={i * 100}>
              <figure className="h-full rounded-3xl border border-white/8 bg-ink-950 p-7">
                <blockquote className="font-display text-[19px] leading-relaxed text-parchment/90 italic">
                  {t.q}
                </blockquote>
                <figcaption className="mt-4 text-[13px] tracking-wide text-gold-300 uppercase">{t.a}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="grain relative overflow-hidden border-t border-white/8" aria-labelledby="cta-title">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "radial-gradient(60% 90% at 50% 110%, rgba(201,162,39,0.16), transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-3xl px-5 py-24 text-center md:py-32">
        <Reveal>
          <h2 id="cta-title" className="font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.05] font-medium text-parchment">
            Run your next trip <span className="text-gold-300 italic">like air-traffic control.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-mist">
            Open the console, pick the Berlin board, break something — then watch the copilot and
            the live wire catch it.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/console"
              className="cursor-pointer touch-manipulation rounded-full bg-gold-500 px-7 py-3.5 text-[15px] font-semibold text-ink-950 transition-colors duration-200 hover:bg-gold-300"
            >
              Open the manager console
            </Link>
            <Link
              href="/trips"
              className="cursor-pointer touch-manipulation rounded-full border border-white/15 px-7 py-3.5 text-[15px] font-medium text-parchment transition-colors duration-200 hover:border-gold-300/60 hover:text-gold-300"
            >
              Browse trips
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
