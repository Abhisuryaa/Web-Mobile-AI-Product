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
  startDate: string; // ISO date
  endDate: string; // ISO date
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
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  kind: string; // e.g. flight, meeting, tour, meal, transfer
  status: string;
}

export interface Hotel {
  id: string;
  tripId: string;
  name: string;
  address: string;
  checkIn: string; // ISO date
  checkOut: string; // ISO date
  confirmationCode: string;
  roomType: string;
  status: string;
}

export interface TransportLeg {
  id: string;
  tripId: string;
  mode: string; // flight | train | bus | car | ferry
  provider: string;
  from: string;
  to: string;
  departAt: string; // ISO datetime
  arriveAt: string; // ISO datetime
  referenceCode: string;
  status: string;
}

export interface TravelDocument {
  id: string;
  tripId: string;
  name: string;
  type: string; // passport | visa | ticket | insurance | invoice | other
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
