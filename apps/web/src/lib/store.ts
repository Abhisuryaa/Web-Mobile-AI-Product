// Production: replace with Prisma (see prisma/schema.prisma).
// This in-memory store is for demo / local dev without a database.
import {
  seedContacts,
  seedDocuments,
  seedHotels,
  seedNotes,
  seedParticipants,
  seedSchedules,
  seedTransports,
  seedTrips,
  seedUpdates,
} from "./seed";
import type {
  Contact,
  Hotel,
  Note,
  Participant,
  ScheduleItem,
  TransportLeg,
  TravelDocument,
  Trip,
  TripUpdate,
} from "./types";

function toMap<T extends { id: string }>(rows: T[]): Map<string, T> {
  return new Map(rows.map((r) => [r.id, { ...r }]));
}

const trips = toMap<Trip>(seedTrips);
const participants = toMap<Participant>(seedParticipants);
const schedules = toMap<ScheduleItem>(seedSchedules);
const hotels = toMap<Hotel>(seedHotels);
const transports = toMap<TransportLeg>(seedTransports);
const documents = toMap<TravelDocument>(seedDocuments);
const contacts = toMap<Contact>(seedContacts);
const notes = toMap<Note>(seedNotes);
const updates = toMap<TripUpdate>(seedUpdates);

let seq = 1000;
export function nextId(prefix: string): string {
  seq += 1;
  return `${prefix}-${seq}`;
}

function byTrip<T extends { tripId: string }>(m: Map<string, T>, tripId: string): T[] {
  return [...m.values()].filter((v) => v.tripId === tripId);
}

// Trips
export function listTrips(): Trip[] {
  return [...trips.values()].sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function getTrip(id: string): Trip | undefined {
  return trips.get(id);
}

export function createTrip(input: Omit<Trip, "id" | "createdAt" | "updatedAt"> & { id?: string }): Trip {
  const now = new Date().toISOString();
  const trip: Trip = {
    ...input,
    id: input.id ?? nextId("trip"),
    createdAt: now,
    updatedAt: now,
  };
  trips.set(trip.id, trip);
  return trip;
}

export function updateTrip(id: string, patch: Partial<Trip>): Trip | undefined {
  const cur = trips.get(id);
  if (!cur) return undefined;
  const next = { ...cur, ...patch, id, updatedAt: new Date().toISOString() };
  trips.set(id, next);
  return next;
}

export function deleteTrip(id: string): boolean {
  return trips.delete(id);
}

// Generic list-by-trip + create helpers
export function listParticipants(tripId: string): Participant[] {
  return byTrip(participants, tripId);
}
export function createParticipant(input: Omit<Participant, "id"> & { id?: string }): Participant {
  const row = { ...input, id: input.id ?? nextId("p") };
  participants.set(row.id, row);
  return row;
}

export function listSchedule(tripId: string): ScheduleItem[] {
  return byTrip(schedules, tripId).sort((a, b) => a.startTime.localeCompare(b.startTime));
}
export function createScheduleItem(input: Omit<ScheduleItem, "id"> & { id?: string }): ScheduleItem {
  const row = { ...input, id: input.id ?? nextId("s") };
  schedules.set(row.id, row);
  return row;
}

export function listHotels(tripId: string): Hotel[] {
  return byTrip(hotels, tripId);
}
export function createHotel(input: Omit<Hotel, "id"> & { id?: string }): Hotel {
  const row = { ...input, id: input.id ?? nextId("h") };
  hotels.set(row.id, row);
  return row;
}

export function listTransport(tripId: string): TransportLeg[] {
  return byTrip(transports, tripId).sort((a, b) => a.departAt.localeCompare(b.departAt));
}
export function createTransportLeg(input: Omit<TransportLeg, "id"> & { id?: string }): TransportLeg {
  const row = { ...input, id: input.id ?? nextId("t") };
  transports.set(row.id, row);
  return row;
}

export function listDocuments(tripId: string): TravelDocument[] {
  return byTrip(documents, tripId);
}
export function createDocument(input: Omit<TravelDocument, "id"> & { id?: string }): TravelDocument {
  const row = { ...input, id: input.id ?? nextId("d") };
  documents.set(row.id, row);
  return row;
}

export function listContacts(tripId: string): Contact[] {
  return byTrip(contacts, tripId);
}
export function createContact(input: Omit<Contact, "id"> & { id?: string }): Contact {
  const row = { ...input, id: input.id ?? nextId("c") };
  contacts.set(row.id, row);
  return row;
}

export function listNotes(tripId: string): Note[] {
  return byTrip(notes, tripId);
}
export function createNote(input: Omit<Note, "id" | "createdAt"> & { id?: string; createdAt?: string }): Note {
  const row: Note = {
    ...input,
    id: input.id ?? nextId("n"),
    createdAt: input.createdAt ?? new Date().toISOString(),
  };
  notes.set(row.id, row);
  return row;
}

export function listUpdates(limit = 20): TripUpdate[] {
  return [...updates.values()]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export function listUpdatesByTrip(tripId: string): TripUpdate[] {
  return byTrip(updates, tripId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addUpdate(
  input: Omit<TripUpdate, "id" | "createdAt"> & { id?: string; createdAt?: string },
): TripUpdate {
  const row: TripUpdate = {
    ...input,
    id: input.id ?? nextId("u"),
    createdAt: input.createdAt ?? new Date().toISOString(),
  };
  updates.set(row.id, row);
  return row;
}
