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

const base = "";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return (await res.json()) as T;
}

export type TripRow = Record<string, string>;
export interface AISummary {
  tripId: string;
  summary?: string;
  suggestions?: string[];
  source: string;
}

export const api = {
  trips: {
    list: () => req<Trip[]>("/api/trips"),
    get: (id: string) => req<Trip>(`/api/trips/${id}`),
    create: (body: unknown) => req<Trip>("/api/trips", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: unknown) =>
      req<Trip>(`/api/trips/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
    remove: (id: string) => req<{ ok: boolean }>(`/api/trips/${id}`, { method: "DELETE" }),
  },
  byTrip: (id: string, resource: string) => req<TripRow[]>(`/api/trips/${id}/${resource}`),
  addByTrip: (id: string, resource: string, body: unknown) =>
    req<TripRow>(`/api/trips/${id}/${resource}`, { method: "POST", body: JSON.stringify(body) }),
  updates: {
    list: () => req<TripUpdate[]>("/api/updates"),
    broadcast: (body: unknown) =>
      req<TripUpdate>("/api/updates", { method: "POST", body: JSON.stringify(body) }),
  },
  ai: {
    summarize: (tripId: string) =>
      req<AISummary>("/api/ai/itinerary-summary", {
        method: "POST",
        body: JSON.stringify({ tripId }),
      }),
    replan: (tripId: string, disruption: string) =>
      req<AISummary>("/api/ai/replan", {
        method: "POST",
        body: JSON.stringify({ tripId, disruption }),
      }),
  },
};

export type { Contact, Hotel, Note, Participant, ScheduleItem, TransportLeg, TravelDocument, Trip, TripUpdate };
