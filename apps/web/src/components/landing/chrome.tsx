import Link from "next/link";
import { IconRadar } from "@/components/icons";

const links = [
  { href: "#live", label: "Live" },
  { href: "#operations", label: "Operations" },
  { href: "#ai", label: "AI Copilot" },
  { href: "#traveler", label: "Traveler app" },
];

export function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="glass border-b border-white/8">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <Link
            href="#top"
            className="flex min-w-0 items-center gap-2.5 rounded-md"
            aria-label="TravelOps AI — back to top"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold-500 text-ink-950">
              <IconRadar className="size-5" />
            </span>
            <span className="min-w-0 truncate text-[15px] font-semibold tracking-tight">
              TravelOps&nbsp;AI
            </span>
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full px-4 py-2 text-sm text-mist transition-colors duration-200 hover:bg-white/6 hover:text-parchment"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/console"
              className="cursor-pointer touch-manipulation rounded-full bg-gold-500 px-4 py-2 text-sm font-semibold text-ink-950 transition-colors duration-200 hover:bg-gold-300"
            >
              Open console
            </Link>
          </div>
        </div>
        <nav
          aria-label="Primary mobile"
          className="rail-scroll flex gap-1 overflow-x-auto px-5 pb-3 md:hidden"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="shrink-0 rounded-full border border-white/10 px-3.5 py-1.5 text-[13px] text-mist transition-colors duration-200 hover:text-parchment"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/8 bg-ink-950">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-full bg-gold-500 text-ink-950">
              <IconRadar className="size-5" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">TravelOps&nbsp;AI</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist">
            The calm operations layer for teams that travel. Managers run the console. Travelers
            carry the itinerary.
          </p>
        </div>
        <nav aria-label="Product">
          <h2 className="text-xs font-semibold tracking-[0.14em] text-mist uppercase">Product</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="#operations" className="text-parchment/80 transition-colors hover:text-gold-300">
                Operations board
              </Link>
            </li>
            <li>
              <Link href="#ai" className="text-parchment/80 transition-colors hover:text-gold-300">
                AI copilot
              </Link>
            </li>
            <li>
              <Link href="#traveler" className="text-parchment/80 transition-colors hover:text-gold-300">
                Traveler app
              </Link>
            </li>
            <li>
              <Link href="/console" className="text-parchment/80 transition-colors hover:text-gold-300">
                Manager console
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Console">
          <h2 className="text-xs font-semibold tracking-[0.14em] text-mist uppercase">Console</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/trips" className="text-parchment/80 transition-colors hover:text-gold-300">
                Trips
              </Link>
            </li>
            <li>
              <Link href="/schedules" className="text-parchment/80 transition-colors hover:text-gold-300">
                Schedules
              </Link>
            </li>
            <li>
              <Link href="/documents" className="text-parchment/80 transition-colors hover:text-gold-300">
                Documents
              </Link>
            </li>
            <li>
              <Link href="/updates" className="text-parchment/80 transition-colors hover:text-gold-300">
                Live updates
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <h2 className="text-xs font-semibold tracking-[0.14em] text-mist uppercase">Deploy</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-parchment/80">
            <li>Web — Vercel</li>
            <li>Mobile — Expo&nbsp;/&nbsp;EAS</li>
            <li className="text-mist">API contract in packages/shared</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs text-mist">
          <p>© 2026 TravelOps AI. Demo workspace — seed data, no real travelers harmed.</p>
          <p className="tnum">3 trips · 2 apps · 1 contract</p>
        </div>
      </div>
    </footer>
  );
}
