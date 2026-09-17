import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { getSchedule } from '../../lib/api';
import { useTrip } from '../../lib/TripContext';
import type { ScheduleItem } from '../../lib/types';
import { TimelineItem } from '../../components/TimelineItem';

export default function ScheduleScreen() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const { selectedTripId } = useTrip();
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!selectedTripId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await getSchedule(selectedTripId);
      if (mounted) {
        setItems([...data].sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`)));
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [selectedTripId]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: dark ? '#0B1D33' : '#fff' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: dark ? '#0B1D33' : '#F8FAFC' }]}>
      <Text style={[styles.heading, { color: dark ? '#fff' : '#0B1D33' }]}>Timeline</Text>
      <Text style={[styles.sub, { color: dark ? '#B8C4D6' : '#4B5563' }]}>
        All times are local. Show up 15 min early for transfers.
      </Text>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <TimelineItem item={item} />}
        ListEmptyComponent={<Text style={{ color: dark ? '#fff' : '#111827' }}>No schedule yet.</Text>}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heading: { fontSize: 22, fontWeight: '800' },
  sub: { fontSize: 14, marginTop: 4, marginBottom: 8 },
});
