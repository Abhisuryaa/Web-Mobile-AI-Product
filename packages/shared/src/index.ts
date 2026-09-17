export type TripStatus =
  | "planning"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Trip {
  id: string;
  title: string;
  destination: string;
  description: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  budget: number;
  createdAt: string;
  updatedAt: string;
}

export interface Participant {
  id: string;
  tripId: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  passportNumber: string;
  status: string;
}

export interface ScheduleItem {
  id: string;
  tripId: string;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  kind: string;
  status: string;
}

export interface Hotel {
  id: string;
  tripId: string;
  name: string;
  address: string;
  checkIn: string;
  checkOut: string;
  confirmationCode: string;
  roomType: string;
  status: string;
}

export interface TransportLeg {
  id: string;
  tripId: string;
  mode: string;
  provider: string;
  from: string;
  to: string;
  departAt: string;
  arriveAt: string;
  referenceCode: string;
  status: string;
}

export interface TravelDocument {
  id: string;
  tripId: string;
  name: string;
  type: string;
  url: string;
  issuedAt: string;
  expiresAt: string;
}

export interface Contact {
  id: string;
  tripId: string;
  name: string;
  organization: string;
  role: string;
  email: string;
  phone: string;
  notes: string;
}

export interface Note {
  id: string;
  tripId: string;
  author: string;
  title: string;
  body: string;
  createdAt: string;
}

export interface TripUpdate {
  id: string;
  tripId: string;
  message: string;
  severity: "info" | "warning" | "critical";
  createdAt: string;
}

// Canonical API contract shared by Next.js web and Expo mobile.
// Web implements these routes with an in-memory store (Prisma-ready).
// Mobile consumes them via EXPO_PUBLIC_API_URL with mock fallback.
export const API_ROUTES = [
  "GET /api/trips",
  "POST /api/trips",
  "GET /api/trips/[id]",
  "GET /api/trips/[id]/participants",
  "GET /api/trips/[id]/schedule",
  "GET /api/trips/[id]/hotels",
  "GET /api/trips/[id]/transport",
  "GET /api/trips/[id]/documents",
  "GET /api/trips/[id]/contacts",
  "GET /api/trips/[id]/notes",
  "GET /api/updates",
  "GET /api/updates/stream (SSE)",
  "POST /api/ai/itinerary-summary",
  "POST /api/ai/replan",
] as const;
