// Production: replace with Prisma
import { NextResponse } from "next/server";
import { z } from "zod";
import { createContact, getTrip, listContacts } from "@/lib/store";

const Schema = z.object({
  name: z.string().min(1),
  organization: z.string().optional().default(""),
  role: z.string().optional().default(""),
  email: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  notes: z.string().optional().default(""),
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!getTrip(id)) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  return NextResponse.json(listContacts(id));
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!getTrip(id)) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json(createContact({ ...parsed.data, tripId: id }), { status: 201 });
}
