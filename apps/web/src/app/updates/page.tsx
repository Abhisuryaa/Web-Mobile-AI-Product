import UpdateFeed from "@/components/UpdateFeed";
import { listUpdates } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function UpdatesPage() {
  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Updates</h1>
      <UpdateFeed initial={listUpdates(20)} />
    </div>
  );
}
