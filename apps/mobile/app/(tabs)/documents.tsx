import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { getDocuments } from '../../lib/api';
import { useTrip } from '../../lib/TripContext';
import type { TravelDocument } from '../../lib/types';

export default function DocumentsScreen() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const { selectedTripId } = useTrip();
  const [docs, setDocs] = useState<TravelDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!selectedTripId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await getDocuments(selectedTripId);
      if (mounted) {
        setDocs(data);
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
      <Text style={[styles.heading, { color: dark ? '#fff' : '#0B1D33' }]}>Travel documents</Text>
      <View style={styles.offlineBanner}>
        <Text style={styles.offlineText}>📴 Saved for offline — available without signal</Text>
      </View>
      <FlatList
        data={docs}
        keyExtractor={(d) => d.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: dark ? '#14213D' : '#fff' }]}>
            <Text style={[styles.title, { color: dark ? '#fff' : '#111827' }]}>{item.title}</Text>
            <Text style={[styles.meta, { color: dark ? '#B8C4D6' : '#4B5563' }]}>
              {item.kind.toUpperCase()} · {item.reference}
            </Text>
            <Text style={[styles.meta, { color: dark ? '#B8C4D6' : '#4B5563' }]}>
              Issued to {item.issuedTo}
              {item.validUntil ? ` · valid until ${item.validUntil}` : ''}
            </Text>
            {item.notes ? (
              <Text style={[styles.notes, { color: dark ? '#8EA0B8' : '#6B7280' }]}>{item.notes}</Text>
            ) : null}
            <Text style={styles.offlineTag}>
              {item.offlineAvailable ? '✓ Offline ready' : 'Requires connection'}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: dark ? '#fff' : '#111827' }}>No documents yet.</Text>}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heading: { fontSize: 22, fontWeight: '800' },
  offlineBanner: { backgroundColor: '#FEF3C7', borderRadius: 12, padding: 12, marginVertical: 12 },
  offlineText: { color: '#92400E', fontWeight: '600', fontSize: 14 },
  card: { borderRadius: 14, padding: 16, marginVertical: 6, minHeight: 88 },
  title: { fontSize: 16, fontWeight: '700' },
  meta: { fontSize: 14, marginTop: 4 },
  notes: { fontSize: 13, marginTop: 6, fontStyle: 'italic' },
  offlineTag: { marginTop: 8, color: '#059669', fontWeight: '700', fontSize: 13 },
});
