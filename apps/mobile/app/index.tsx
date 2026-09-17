import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { getTrips } from '../lib/api';
import { useTrip } from '../lib/TripContext';
import type { Trip } from '../lib/types';
import { TripCard } from '../components/TripCard';

export default function TripSelector() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const router = useRouter();
  const { selectedTripId, setSelectedTripId } = useTrip();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getTrips().then((t) => {
      if (!mounted) return;
      setTrips(t);
      setLoading(false);
      if (!selectedTripId && t.length > 0) setSelectedTripId(t[0].id);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const select = (id: string) => {
    setSelectedTripId(id);
    router.push('/(tabs)/itinerary');
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: dark ? '#0B1D33' : '#F8FAFC' }]}>
      <Text style={[styles.heading, { color: dark ? '#fff' : '#0B1D33' }]}>Choose your trip</Text>
      <Text style={[styles.sub, { color: dark ? '#B8C4D6' : '#4B5563' }]}>
        Traveler companion — pick an active trip to see itinerary, docs and live updates.
      </Text>
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 32 }} />
      ) : (
        trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            selected={trip.id === selectedTripId}
            onPress={() => select(trip.id)}
          />
        ))
      )}
      {selectedTripId ? (
        <Link href="/(tabs)/itinerary" asChild>
          <Pressable style={styles.cta}>
            <Text style={styles.ctaText}>Continue → Itinerary</Text>
          </Pressable>
        </Link>
      ) : null}
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, paddingTop: 64 },
  heading: { fontSize: 28, fontWeight: '800' },
  sub: { fontSize: 15, marginTop: 8, lineHeight: 22 },
  cta: {
    backgroundColor: '#2F80ED',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    minHeight: 56,
    justifyContent: 'center',
  },
  ctaText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
