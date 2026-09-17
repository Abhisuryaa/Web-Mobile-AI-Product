import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import type { ScheduleItem } from '../lib/types';

const KIND_COLOR: Record<ScheduleItem['kind'], string> = {
  flight: '#2F80ED',
  hotel: '#7C3AED',
  meeting: '#059669',
  transfer: '#EA580C',
  activity: '#DB2777',
  meal: '#CA8A04',
  other: '#6B7280',
};

export function TimelineItem({ item }: { item: ScheduleItem }) {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  return (
    <View style={[styles.row, { borderColor: dark ? '#2A3A55' : '#E5E7EB' }]}>
      <View style={[styles.dot, { backgroundColor: KIND_COLOR[item.kind] }]} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.time, { color: dark ? '#8EA0B8' : '#6B7280' }]}>
          {item.day} · {item.date} · {item.startTime}–{item.endTime}
        </Text>
        <Text style={[styles.title, { color: dark ? '#fff' : '#111827' }]}>{item.title}</Text>
        <Text style={[styles.desc, { color: dark ? '#B8C4D6' : '#4B5563' }]}>{item.description}</Text>
        <Text style={[styles.loc, { color: dark ? '#8EA0B8' : '#6B7280' }]}>{item.location}</Text>
      </View>
      <View style={styles.statusPill}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    alignItems: 'flex-start',
  },
  dot: { width: 12, height: 12, borderRadius: 6, marginTop: 6 },
  time: { fontSize: 12, fontWeight: '600' },
  title: { fontSize: 16, fontWeight: '700', marginTop: 2 },
  desc: { fontSize: 14, marginTop: 4 },
  loc: { fontSize: 13, marginTop: 2 },
  statusPill: { backgroundColor: '#EEF2FF', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  statusText: { fontSize: 11, color: '#3730A3', fontWeight: '700' },
});
