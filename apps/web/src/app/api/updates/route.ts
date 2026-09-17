// Production: replace with Prisma
import { NextResponse } from "next/server";
import { z } from "zod";
import { addUpdate, listUpdates } from "@/lib/store";

const Schema = z.object({
  tripId: z.string().min(1),
  message: z.string().min(1),
  severity: z.enum(["info", "warning", "critical"]).default("info"),
});

export async function GET() {
  return NextResponse.json(listUpdates(20));
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json(addUpdate(parsed.data), { status: 201 });
}
