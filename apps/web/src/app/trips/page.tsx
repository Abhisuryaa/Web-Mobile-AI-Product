"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Trip } from "@/lib/types";
import TripCard from "@/components/TripCard";

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("2026-12-01");
  const [endDate, setEndDate] = useState("2026-12-05");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setTrips(await api.trips.list());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  useEffect(() => {
    let cancelled = false;
    api.trips
      .list()
      .then((data) => {
        if (!cancelled) setTrips(data);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await api.trips.create({ title, destination, startDate, endDate, status: "planning", budget: 0 });
      setTitle("");
      setDestination("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Trips</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <form onSubmit={submit} className="grid gap-2 rounded border border-zinc-200 bg-white p-4 md:grid-cols-5">
        <input className="rounded border p-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input className="rounded border p-2" placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} required />
        <input className="rounded border p-2" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input className="rounded border p-2" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <button className="rounded bg-zinc-900 p-2 text-white" type="submit">
          Create trip
        </button>
      </form>
      <div className="grid gap-3 md:grid-cols-2">
        {trips.map((t) => (
          <TripCard key={t.id} trip={t} />
        ))}
      </div>
    </div>
  );
}
