import { NextResponse } from "next/server";

export const revalidate = 20;

interface AdsbAircraft {
  flight?: string;
  r?: string;
  t?: string;
  alt_baro?: number | string;
  gs?: number;
  track?: number;
  lat?: number;
  lon?: number;
}

/** Live aircraft over Berlin via the public adsb.lol community feed. No key needed. */
export async function GET() {
  try {
    const res = await fetch("https://api.adsb.lol/v2/point/52.52/13.405/80", {
      headers: { "User-Agent": "TravelOpsAI-demo/1.0" },
      next: { revalidate: 20 },
    });
    if (!res.ok) throw new Error(`adsb.lol answered ${res.status}`);
    const data = (await res.json()) as { ac?: AdsbAircraft[] };
    const aircraft = (data.ac ?? [])
      .filter((a) => a.flight && typeof a.alt_baro === "number")
      .sort((a, b) => (b.alt_baro as number) - (a.alt_baro as number))
      .slice(0, 14)
      .map((a) => ({
        callsign: String(a.flight).trim(),
        reg: a.r ?? "—",
        type: a.t ?? "—",
        altFt: Math.round(a.alt_baro as number),
        speedKt: Math.round(a.gs ?? 0),
        heading: Math.round(a.track ?? 0),
        lat: a.lat ?? null,
        lon: a.lon ?? null,
      }));
    return NextResponse.json({
      source: "adsb.lol",
      area: "Berlin · 80 NM",
      updatedAt: new Date().toISOString(),
      aircraft,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upstream feed unreachable" },
      { status: 502 },
    );
  }
}
