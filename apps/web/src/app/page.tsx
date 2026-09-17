import { SiteFooter, SiteNav } from "@/components/landing/chrome";
import { Hero, Ticker } from "@/components/landing/hero";
import LiveTracking from "@/components/landing/LiveTracking";
import {
  AiSection,
  ChapterFlow,
  ChapterProblem,
  FieldNotes,
  FinalCta,
  OpsBento,
  TravelerApp,
} from "@/components/landing/sections";
import {
  listContacts,
  listDocuments,
  listParticipants,
  listSchedule,
  listTrips,
  listUpdates,
} from "@/lib/store";

export default function LandingPage() {
  const trips = listTrips();
  const updates = listUpdates(8);
  const travelerCount = trips.reduce((n, t) => n + listParticipants(t.id).length, 0);
  const berlin = trips.find((t) => t.id === "trip-berlin") ?? trips[0];
  const schedule = berlin ? listSchedule(berlin.id) : [];
  const docsCount = trips.reduce((n, t) => n + listDocuments(t.id).length, 0);
  const contactsCount = trips.reduce((n, t) => n + listContacts(t.id).length, 0);

  return (
    <div id="top" className="min-h-screen bg-ink-950 text-parchment">
      <SiteNav />
      <main id="main">
        <Hero trips={trips} travelerCount={travelerCount} updates={updates} />
        <Ticker updates={updates} />
        <LiveTracking />
        <ChapterProblem />
        <ChapterFlow />
        <OpsBento trips={trips} updates={updates} travelerCount={travelerCount} />
        <AiSection trips={trips} />
        <TravelerApp
          schedule={schedule}
          trip={berlin}
          docsCount={docsCount}
          contactsCount={contactsCount}
        />
        <FieldNotes />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
