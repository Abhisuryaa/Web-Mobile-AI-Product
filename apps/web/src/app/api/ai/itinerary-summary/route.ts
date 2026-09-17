// Production: replace with Prisma
import { NextResponse } from "next/server";
import { z } from "zod";
import { getTrip, listHotels, listParticipants, listSchedule, listTransport } from "@/lib/store";

const Schema = z.object({ tripId: z.string().min(1) });

function heuristicSummary(tripId: string): string {
  const trip = getTrip(tripId);
  if (!trip) return "Trip not found.";
  const parts = listParticipants(tripId);
  const sched = listSchedule(tripId);
  const hotels = listHotels(tripId);
  const legs = listTransport(tripId);
  const lines = [
    `${trip.title} — ${trip.destination} (${trip.startDate} → ${trip.endDate}, status: ${trip.status}).`,
    `Travelers (${parts.length}): ${parts.map((p) => `${p.name} (${p.role})`).join(", ") || "none"}.`,
    `Schedule (${sched.length} items):`,
    ...sched.slice(0, 8).map((s) => ` - ${s.startTime} ${s.title} @ ${s.location} [${s.kind}]`),
    `Hotels (${hotels.length}): ${hotels.map((h) => `${h.name} ${h.checkIn}→${h.checkOut}`).join("; ") || "none"}.`,
    `Transport (${legs.length}): ${legs.map((t) => `${t.mode} ${t.provider} ${t.from}→${t.to} ${t.departAt}`).join("; ") || "none"}.`,
    `Budget: $${trip.budget}. ${trip.description}`,
  ];
  return lines.join("\n");
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { tripId } = parsed.data;

  const apiKey = process.env.OPENAI_API_KEY;
  const heuristic = heuristicSummary(tripId);

  if (!apiKey) {
    return NextResponse.json({ tripId, summary: heuristic, source: "heuristic" });
  }

  try {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a travel operations assistant. Summarize itineraries concisely." },
        { role: "user", content: `Summarize this itinerary:\n${heuristic}` },
      ],
      max_tokens: 400,
    });
    const summary = completion.choices[0]?.message?.content ?? heuristic;
    return NextResponse.json({ tripId, summary, source: "openai" });
  } catch (e) {
    return NextResponse.json({
      tripId,
      summary: heuristic,
      source: "heuristic-fallback",
      error: e instanceof Error ? e.message : String(e),
    });
  }
}
