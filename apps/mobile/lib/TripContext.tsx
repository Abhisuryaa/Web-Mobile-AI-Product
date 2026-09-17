import { createContext, useContext, useState, type ReactNode } from 'react';

interface TripContextValue {
  selectedTripId: string | null;
  setSelectedTripId: (id: string | null) => void;
}

const TripContext = createContext<TripContextValue>({
  selectedTripId: null,
  setSelectedTripId: () => {},
});

export function TripProvider({ children }: { children: ReactNode }) {
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  return (
    <TripContext.Provider value={{ selectedTripId, setSelectedTripId }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  return useContext(TripContext);
}
