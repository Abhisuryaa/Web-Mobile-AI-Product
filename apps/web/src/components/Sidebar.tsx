import Link from "next/link";
import { IconRadar } from "@/components/icons";

const links = [
  { href: "/console", label: "Dashboard" },
  { href: "/trips", label: "Trips" },
  { href: "/schedules", label: "Schedules" },
  { href: "/hotels", label: "Hotels" },
  { href: "/transport", label: "Transport" },
  { href: "/documents", label: "Documents" },
  { href: "/contacts", label: "Contacts" },
  { href: "/notes", label: "Notes" },
  { href: "/updates", label: "Updates" },
  { href: "/ai", label: "AI Assistant" },
];

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-stone-200 bg-stone-950 p-4 text-stone-100 max-md:hidden">
      <div className="mb-6 flex items-center gap-2.5 px-2">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold-500 text-stone-950">
          <IconRadar className="size-5" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-bold">TravelOps AI</span>
          <span className="block text-xs text-stone-400">Manager Console</span>
        </span>
      </div>
      <nav aria-label="Console" className="flex flex-col gap-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-lg px-3 py-2 text-sm text-stone-300 transition-colors duration-200 hover:bg-white/8 hover:text-white"
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <Link
        href="/"
        className="mt-6 block rounded-lg border border-white/10 px-3 py-2 text-sm text-stone-300 transition-colors duration-200 hover:border-gold-300/50 hover:text-gold-300"
      >
        ← Back to site
      </Link>
    </aside>
  );
}
