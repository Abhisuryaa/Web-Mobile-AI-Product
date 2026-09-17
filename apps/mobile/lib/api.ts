import { mockContacts, mockDocuments, mockSchedule, mockTrips, mockUpdates } from './mock';
import type { Contact, ScheduleItem, TravelDocument, Trip, TripUpdate } from './types';

export const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

async function fetchJson<T>(path: string, init?: RequestInit, timeoutMs = 6000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    });
    if (!res.ok) throw new Error(`API ${res.status} for ${path}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export async function getTrips(): Promise<Trip[]> {
  try {
    return await fetchJson<Trip[]>('/api/trips');
  } catch {
    return mockTrips;
  }
}

export async function getTrip(id: string): Promise<Trip | undefined> {
  try {
    return await fetchJson<Trip>(`/api/trips/${id}`);
  } catch {
    return mockTrips.find((t) => t.id === id || t.tripId === id);
  }
}

export async function getSchedule(tripId: string): Promise<ScheduleItem[]> {
  try {
    return await fetchJson<ScheduleItem[]>(`/api/trips/${tripId}/schedule`);
  } catch {
    return mockSchedule.filter((s) => s.tripId === tripId);
  }
}

export async function getDocuments(tripId: string): Promise<TravelDocument[]> {
  try {
    return await fetchJson<TravelDocument[]>(`/api/trips/${tripId}/documents`);
  } catch {
    return mockDocuments.filter((d) => d.tripId === tripId);
  }
}

export async function getContacts(tripId: string): Promise<Contact[]> {
  try {
    return await fetchJson<Contact[]>(`/api/trips/${tripId}/contacts`);
  } catch {
    return mockContacts.filter((c) => c.tripId === tripId);
  }
}

export async function getUpdates(tripId: string): Promise<TripUpdate[]> {
  try {
    return await fetchJson<TripUpdate[]>(`/api/trips/${tripId}/updates`);
  } catch {
    return mockUpdates.filter((u) => u.tripId === tripId);
  }
}

export async function postAiSummary(tripId: string): Promise<{ summary: string }> {
  try {
    return await fetchJson<{ summary: string }>(`/api/trips/${tripId}/ai-summary`, {
      method: 'POST',
    });
  } catch {
    const trip = mockTrips.find((t) => t.id === tripId || t.tripId === tripId);
    const items = mockSchedule.filter((s) => s.tripId === tripId);
    const summary = trip
      ? `${trip.title} to ${trip.destination} (${trip.startDate} → ${trip.endDate}). ${items.length} scheduled items. Confirmation ${trip.confirmationCode}. (Offline summary)`
      : 'Trip summary unavailable offline.';
    return { summary };
  }
}
