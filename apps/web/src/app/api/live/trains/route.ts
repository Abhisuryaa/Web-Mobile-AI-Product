import { NextResponse } from "next/server";

export const revalidate = 60;

interface BoardEntry {
  category?: string;
  number?: string;
  operator?: string;
  to?: string;
  stop?: {
    departure?: string;
    departureTimestamp?: number;
    delay?: number | null;
    platform?: string;
  };
}

function toIso(s: string): string {
  return s.replace(/([+-]\d{2})(\d{2})$/, "$1:$2");
}

/** Live departures at Zürich HB via the public Swiss transport API. No key needed. */
export async function GET() {
  try {
    const res = await fetch(
      "https://transport.opendata.ch/v1/stationboard?station=Z%C3%BCrich%20HB&limit=10",
      {
        headers: { "User-Agent": "TravelOpsAI-demo/1.0" },
        next: { revalidate: 60 },
      },
    );
    if (!res.ok) throw new Error(`transport.opendata.ch answered ${res.status}`);
    const data = (await res.json()) as { station?: { name?: string }; stationboard?: BoardEntry[] };
    const departures = (data.stationboard ?? [])
      .filter((d) => d.stop?.departureTimestamp)
      .slice(0, 8)
      .map((d) => ({
        line: `${d.category ?? ""} ${d.number ?? ""}`.trim(),
        operator: d.operator ?? "",
        to: d.to ?? "—",
        departure: toIso(d.stop?.departure ?? ""),
        delayMin: d.stop?.delay ?? 0,
        platform: d.stop?.platform ?? "—",
      }));
    return NextResponse.json({
      source: "transport.opendata.ch",
      station: data.station?.name ?? "Zürich HB",
      updatedAt: new Date().toISOString(),
      departures,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upstream feed unreachable" },
      { status: 502 },
    );
  }
}
