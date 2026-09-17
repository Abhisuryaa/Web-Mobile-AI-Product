export type TripStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';

export interface Trip {
  id: string;
  tripId: string;
  title: string;
  destination: string;
  description: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  travelerName: string;
  confirmationCode: string;
}

export interface Participant {
  id: string;
  tripId: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
}

export interface ScheduleItem {
  id: string;
  tripId: string;
  day: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  location: string;
  kind: 'flight' | 'hotel' | 'meeting' | 'transfer' | 'activity' | 'meal' | 'other';
  status: 'scheduled' | 'confirmed' | 'delayed' | 'cancelled' | 'done';
}

export interface Hotel {
  id: string;
  tripId: string;
  name: string;
  address: string;
  checkIn: string;
  checkOut: string;
  confirmationCode: string;
  phone?: string;
}

export interface TransportLeg {
  id: string;
  tripId: string;
  kind: 'flight' | 'train' | 'car' | 'transfer';
  from: string;
  to: string;
  departure: string;
  arrival: string;
  carrier: string;
  confirmationCode: string;
  seat?: string;
}

export type DocumentKind = 'passport' | 'visa' | 'ticket' | 'hotel' | 'insurance' | 'other';

export interface TravelDocument {
  id: string;
  tripId: string;
  title: string;
  kind: DocumentKind;
  reference: string;
  issuedTo: string;
  validUntil?: string;
  offlineAvailable: boolean;
  notes?: string;
}

export interface Contact {
  id: string;
  tripId: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  emergency: boolean;
}

export interface Note {
  id: string;
  tripId: string;
  title: string;
  body: string;
  createdAt: string;
}

export interface TripUpdate {
  id: string;
  tripId: string;
  title: string;
  message: string;
  createdAt: string;
  severity: 'info' | 'warning' | 'critical';
  read: boolean;
}
