// Production: replace with Prisma
import { NextResponse } from "next/server";
import { z } from "zod";
import { createScheduleItem, getTrip, listSchedule } from "@/lib/store";

const Schema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(""),
  location: z.string().optional().default(""),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  kind: z.string().optional().default("meeting"),
  status: z.string().optional().default("scheduled"),
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!getTrip(id)) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  return NextResponse.json(listSchedule(id));
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!getTrip(id)) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json(createScheduleItem({ ...parsed.data, tripId: id }), { status: 201 });
}
