// Production: replace with Prisma
import { NextResponse } from "next/server";
import { z } from "zod";
import { getTrip, listSchedule, listTransport } from "@/lib/store";

const Schema = z.object({
  tripId: z.string().min(1),
  disruption: z.string().min(1),
});

function heuristicReplan(tripId: string, disruption: string): string[] {
  const trip = getTrip(tripId);
  if (!trip) return ["Trip not found — cannot replan."];
  const sched = listSchedule(tripId);
  const legs = listTransport(tripId);
  const d = disruption.toLowerCase();
  const out: string[] = [];
  if (d.includes("strike") || d.includes("flight") || d.includes("cancel")) {
    out.push(`Rebook affected flight legs (${legs.map((l) => l.provider).join(", ") || "none"}) on alternate carriers; hold 2 backup seats.`);
    out.push("Shift morning meetings 3h later; notify contacts via broadcast update.");
    out.push("Activate ground-transfer standby for airport ↔ hotel legs.");
  }
  if (d.includes("hotel") || d.includes("overbook")) {
    out.push("Request overflow rooms at partner hotel within 2km; keep same check-in/out dates.");
  }
  if (d.includes("visa") || d.includes("passport")) {
    out.push("Escalate to travel docs desk; prepare embassy appointment + expedited processing.");
  }
  out.push(`Review ${sched.length} schedule items for conflicts after shifting; prioritize customer-facing events.`);
  out.push(`Post a 'warning' TripUpdate for ${trip.title} describing: ${disruption}`);
  return out;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { tripId, disruption } = parsed.data;

  const suggestions = heuristicReplan(tripId, disruption);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ tripId, disruption, suggestions, source: "heuristic" });
  }
  try {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a travel operations assistant. Suggest concrete replan steps." },
        {
          role: "user",
          content: `Trip ${tripId} disruption: ${disruption}\nBaseline suggestions:\n- ${suggestions.join("\n- ")}\nRefine and extend into a numbered action plan.`,
        },
      ],
      max_tokens: 500,
    });
    const text = completion.choices[0]?.message?.content ?? suggestions.join("\n");
    return NextResponse.json({ tripId, disruption, suggestions: text.split("\n").filter(Boolean), source: "openai" });
  } catch (e) {
    return NextResponse.json({
      tripId,
      disruption,
      suggestions,
      source: "heuristic-fallback",
      error: e instanceof Error ? e.message : String(e),
    });
  }
}
