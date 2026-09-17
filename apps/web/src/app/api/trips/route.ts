// Production: replace with Prisma
import { NextResponse } from "next/server";
import { z } from "zod";
import { createTrip, listTrips } from "@/lib/store";

const TripSchema = z.object({
  title: z.string().min(1),
  destination: z.string().min(1),
  description: z.string().optional().default(""),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  status: z.enum(["planning", "confirmed", "in_progress", "completed", "cancelled"]).default("planning"),
  budget: z.number().int().nonnegative().default(0),
});

export async function GET() {
  return NextResponse.json(listTrips());
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = TripSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const trip = createTrip(parsed.data);
  return NextResponse.json(trip, { status: 201 });
}
