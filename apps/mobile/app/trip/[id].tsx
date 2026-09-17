import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { getDocuments, getTrip } from '../../lib/api';
import { useTrip } from '../../lib/TripContext';
import type { TravelDocument, Trip } from '../../lib/types';

export default function TripDetailScreen() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const { id } = useLocalSearchParams<{ id: string }>();
  const { setSelectedTripId } = useTrip();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [docs, setDocs] = useState<TravelDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!id || typeof id !== 'string') {
        setLoading(false);
        return;
      }
      const [t, d] = await Promise.all([getTrip(id), getDocuments(id)]);
      if (!mounted) return;
      setTrip(t ?? null);
      setDocs(d);
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: dark ? '#0B1D33' : '#fff' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={[styles.center, { backgroundColor: dark ? '#0B1D33' : '#fff' }]}>
        <Text style={{ color: dark ? '#fff' : '#111827' }}>Trip not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: dark ? '#0B1D33' : '#F8FAFC' }} contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: dark ? '#fff' : '#0B1D33' }]}>{trip.title}</Text>
      <Text style={[styles.sub, { color: dark ? '#B8C4D6' : '#4B5563' }]}>
        {trip.destination} · {trip.startDate} → {trip.endDate}
      </Text>
      <Text style={[styles.body, { color: dark ? '#B8C4D6' : '#4B5563' }]}>{trip.description}</Text>
      <Text style={[styles.meta, { color: dark ? '#8EA0B8' : '#6B7280' }]}>
        Status {trip.status} · Conf {trip.confirmationCode}
      </Text>
      <Text style={[styles.section, { color: dark ? '#fff' : '#0B1D33' }]}>Documents ({docs.length})</Text>
      {docs.map((d) => (
        <Text key={d.id} style={[styles.doc, { color: dark ? '#B8C4D6' : '#374151' }]}>
          • {d.title} ({d.reference})
        </Text>
      ))}
      <Link
        href="/(tabs)/itinerary"
        onPress={() => setSelectedTripId(trip.id)}
        asChild
      >
        <Pressable style={styles.cta}>
          <Text style={styles.ctaText}>Open this trip</Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '800' },
  sub: { fontSize: 15, marginTop: 6 },
  body: { fontSize: 15, marginTop: 12, lineHeight: 22 },
  meta: { fontSize: 13, marginTop: 8 },
  section: { fontSize: 18, fontWeight: '700', marginTop: 20, marginBottom: 6 },
  doc: { fontSize: 14, marginTop: 4 },
  cta: {
    backgroundColor: '#2F80ED',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    minHeight: 56,
    justifyContent: 'center',
  },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
