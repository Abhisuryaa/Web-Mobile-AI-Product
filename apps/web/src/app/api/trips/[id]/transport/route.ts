// Production: replace with Prisma
import { NextResponse } from "next/server";
import { z } from "zod";
import { createTransportLeg, getTrip, listTransport } from "@/lib/store";

const Schema = z.object({
  mode: z.string().min(1),
  provider: z.string().optional().default(""),
  from: z.string().min(1),
  to: z.string().min(1),
  departAt: z.string().min(1),
  arriveAt: z.string().min(1),
  referenceCode: z.string().optional().default(""),
  status: z.string().optional().default("reserved"),
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!getTrip(id)) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  return NextResponse.json(listTransport(id));
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!getTrip(id)) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json(createTransportLeg({ ...parsed.data, tripId: id }), { status: 201 });
}
