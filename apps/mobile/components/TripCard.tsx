import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import type { Trip } from '../lib/types';

export function TripCard({
  trip,
  selected,
  onPress,
}: {
  trip: Trip;
  selected?: boolean;
  onPress: () => void;
}) {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={[
        styles.card,
        { backgroundColor: dark ? '#14213D' : '#fff', borderColor: selected ? '#2F80ED' : dark ? '#2A3A55' : '#E5E7EB' },
        selected && styles.selected,
      ]}
    >
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: dark ? '#fff' : '#111827' }]}>{trip.title}</Text>
          <Text style={[styles.sub, { color: dark ? '#B8C4D6' : '#4B5563' }]}>{trip.destination}</Text>
          <Text style={[styles.meta, { color: dark ? '#8EA0B8' : '#6B7280' }]}>
            {trip.startDate} → {trip.endDate} · {trip.status.toUpperCase()}
          </Text>
          <Text style={[styles.meta, { color: dark ? '#8EA0B8' : '#6B7280' }]}>
            Conf: {trip.confirmationCode}
          </Text>
        </View>
        <View style={[styles.badge, selected && styles.badgeActive]}>
          <Text style={[styles.badgeText, selected && styles.badgeTextActive]}>
            {selected ? 'Active' : 'Select'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    minHeight: 88,
  },
  selected: { shadowOpacity: 0.12, shadowRadius: 8, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 18, fontWeight: '700' },
  sub: { fontSize: 15, marginTop: 2 },
  meta: { fontSize: 13, marginTop: 4 },
  badge: {
    backgroundColor: '#EAF1FE',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  badgeActive: { backgroundColor: '#2F80ED' },
  badgeText: { color: '#2F80ED', fontWeight: '700' },
  badgeTextActive: { color: '#fff' },
});
