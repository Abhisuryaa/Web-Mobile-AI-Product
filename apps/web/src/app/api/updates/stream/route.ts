// Production: replace with Prisma (publish from DB / queue in prod).
// SSE stream emitting seed updates every ~5s + heartbeat.
import { listUpdates } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();
  let timer: ReturnType<typeof setInterval> | undefined;
  let heartbeat: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: unknown, event = "message") => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      send({ hello: "travelops-stream", at: new Date().toISOString() }, "hello");

      let i = 0;
      timer = setInterval(() => {
        const updates = listUpdates(20);
        if (updates.length === 0) return;
        send(updates[i % updates.length], "update");
        i += 1;
      }, 5000);

      heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(`: heartbeat ${Date.now()}\n\n`));
      }, 15000);
    },
    cancel() {
      if (timer) clearInterval(timer);
      if (heartbeat) clearInterval(heartbeat);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
