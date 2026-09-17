// Production: replace with Prisma
import { NextResponse } from "next/server";
import { z } from "zod";
import { createDocument, getTrip, listDocuments } from "@/lib/store";

const Schema = z.object({
  name: z.string().min(1),
  type: z.string().optional().default("other"),
  url: z.string().optional().default(""),
  issuedAt: z.string().optional().default(""),
  expiresAt: z.string().optional().default(""),
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!getTrip(id)) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  return NextResponse.json(listDocuments(id));
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!getTrip(id)) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json(createDocument({ ...parsed.data, tripId: id }), { status: 201 });
}
