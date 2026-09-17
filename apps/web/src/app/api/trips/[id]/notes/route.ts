// Production: replace with Prisma
import { NextResponse } from "next/server";
import { z } from "zod";
import { createNote, getTrip, listNotes } from "@/lib/store";

const Schema = z.object({
  author: z.string().optional().default(""),
  title: z.string().min(1),
  body: z.string().optional().default(""),
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!getTrip(id)) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  return NextResponse.json(listNotes(id));
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!getTrip(id)) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json(createNote({ ...parsed.data, tripId: id }), { status: 201 });
}
