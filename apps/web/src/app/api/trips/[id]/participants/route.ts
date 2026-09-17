// Production: replace with Prisma
import { NextResponse } from "next/server";
import { z } from "zod";
import { createParticipant, getTrip, listParticipants } from "@/lib/store";

const Schema = z.object({
  name: z.string().min(1),
  email: z.string().min(1),
  role: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  passportNumber: z.string().optional().default(""),
  status: z.string().optional().default("pending"),
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!getTrip(id)) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  return NextResponse.json(listParticipants(id));
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!getTrip(id)) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json(createParticipant({ ...parsed.data, tripId: id }), { status: 201 });
}
