import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import type { TripUpdate } from '../lib/types';

const SEVERITY_COLOR: Record<TripUpdate['severity'], string> = {
  info: '#2F80ED',
  warning: '#D97706',
  critical: '#DC2626',
};

export function UpdateItem({ update }: { update: TripUpdate }) {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: dark ? '#14213D' : '#fff', borderColor: dark ? '#2A3A55' : '#E5E7EB' },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.sev, { backgroundColor: SEVERITY_COLOR[update.severity] }]} />
        <Text style={[styles.title, { color: dark ? '#fff' : '#111827' }]}>{update.title}</Text>
      </View>
      <Text style={[styles.msg, { color: dark ? '#B8C4D6' : '#4B5563' }]}>{update.message}</Text>
      <Text style={[styles.date, { color: dark ? '#8EA0B8' : '#6B7280' }]}>
        {new Date(update.createdAt).toLocaleString()} · {update.severity.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 14, padding: 14, marginVertical: 6 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sev: { width: 10, height: 10, borderRadius: 5 },
  title: { fontSize: 16, fontWeight: '700' },
  msg: { fontSize: 14, marginTop: 6, lineHeight: 20 },
  date: { fontSize: 12, marginTop: 6 },
});
