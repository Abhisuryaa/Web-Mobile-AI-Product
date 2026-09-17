import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { getSchedule, getTrip, postAiSummary } from '../../lib/api';
import { useTrip } from '../../lib/TripContext';
import type { ScheduleItem, Trip } from '../../lib/types';
import { TimelineItem } from '../../components/TimelineItem';

export default function ItineraryScreen() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const { selectedTripId } = useTrip();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!selectedTripId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const [t, s] = await Promise.all([getTrip(selectedTripId), getSchedule(selectedTripId)]);
      if (!mounted) return;
      setTrip(t ?? null);
      setSchedule(s);
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [selectedTripId]);

  const onAiSummary = async () => {
    if (!selectedTripId) return;
    setSummaryLoading(true);
    const res = await postAiSummary(selectedTripId);
    setSummary(res.summary);
    setSummaryLoading(false);
  };

  if (!selectedTripId) {
    return (
      <View style={[styles.center, { backgroundColor: dark ? '#0B1D33' : '#fff' }]}>
        <Text style={{ color: dark ? '#fff' : '#111827' }}>No trip selected. Go back and pick a trip.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: dark ? '#0B1D33' : '#fff' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const days = [...new Set(schedule.map((s) => s.day))];

  return (
    <ScrollView style={{ backgroundColor: dark ? '#0B1D33' : '#F8FAFC' }} contentContainerStyle={styles.container}>
      {trip ? (
        <View style={[styles.header, { backgroundColor: dark ? '#14213D' : '#fff' }]}>
          <Text style={[styles.title, { color: dark ? '#fff' : '#0B1D33' }]}>{trip.title}</Text>
          <Text style={[styles.dest, { color: dark ? '#B8C4D6' : '#4B5563' }]}>
            {trip.destination} · {trip.startDate} → {trip.endDate}
          </Text>
          <Text style={[styles.conf, { color: dark ? '#8EA0B8' : '#6B7280' }]}>
            Traveler: {trip.travelerName} · Conf {trip.confirmationCode}
          </Text>
          <Pressable onPress={onAiSummary} style={styles.aiButton} accessibilityRole="button">
            <Text style={styles.aiButtonText}>
              {summaryLoading ? 'Summarizing…' : '✨ Get AI trip summary'}
            </Text>
          </Pressable>
          {summary ? (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>{summary}</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {days.map((day) => (
        <View key={day} style={{ marginTop: 16 }}>
          <Text style={[styles.day, { color: dark ? '#fff' : '#0B1D33' }]}>{day}</Text>
          {schedule
            .filter((s) => s.day === day)
            .map((item) => (
              <TimelineItem key={item.id} item={item} />
            ))}
        </View>
      ))}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  header: { borderRadius: 16, padding: 16, shadowOpacity: 0.06, shadowRadius: 6, elevation: 1 },
  title: { fontSize: 22, fontWeight: '800' },
  dest: { fontSize: 15, marginTop: 4 },
  conf: { fontSize: 13, marginTop: 4 },
  aiButton: {
    backgroundColor: '#0B1D33',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    minHeight: 52,
    justifyContent: 'center',
  },
  aiButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  summaryBox: { backgroundColor: '#EAF1FE', borderRadius: 12, padding: 12, marginTop: 12 },
  summaryText: { color: '#0B1D33', fontSize: 14, lineHeight: 20 },
  day: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
});
