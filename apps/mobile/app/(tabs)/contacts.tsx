import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { getContacts } from '../../lib/api';
import { useTrip } from '../../lib/TripContext';
import type { Contact } from '../../lib/types';

export default function ContactsScreen() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const { selectedTripId } = useTrip();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!selectedTripId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await getContacts(selectedTripId);
      if (mounted) {
        setContacts(data);
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
      <Text style={[styles.heading, { color: dark ? '#fff' : '#0B1D33' }]}>Contacts</Text>
      <Text style={[styles.sub, { color: dark ? '#B8C4D6' : '#4B5563' }]}>
        Tap to call. Emergency contacts are listed first.
      </Text>
      <FlatList
        data={[...contacts].sort((a, b) => Number(b.emergency) - Number(a.emergency))}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              { backgroundColor: dark ? '#14213D' : '#fff' },
              item.emergency && styles.emergencyCard,
            ]}
          >
            <Text style={[styles.name, { color: dark ? '#fff' : '#111827' }]}>
              {item.emergency ? '🚨 ' : ''}
              {item.name}
            </Text>
            <Text style={[styles.role, { color: dark ? '#B8C4D6' : '#4B5563' }]}>{item.role}</Text>
            <View style={styles.actions}>
              <Pressable
                onPress={() => Linking.openURL(`tel:${item.phone}`)}
                style={styles.callButton}
                accessibilityRole="button"
                accessibilityLabel={`Call ${item.name}`}
              >
                <Text style={styles.callText}>📞 {item.phone}</Text>
              </Pressable>
              {item.email ? (
                <Pressable onPress={() => Linking.openURL(`mailto:${item.email}`)} style={styles.mailButton}>
                  <Text style={styles.mailText}>{item.email}</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: dark ? '#fff' : '#111827' }}>No contacts yet.</Text>}
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
  card: { borderRadius: 14, padding: 16, marginVertical: 6, minHeight: 96 },
  emergencyCard: { borderWidth: 2, borderColor: '#DC2626' },
  name: { fontSize: 17, fontWeight: '700' },
  role: { fontSize: 14, marginTop: 2 },
  actions: { marginTop: 10, gap: 8 },
  callButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  callText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  mailButton: { paddingVertical: 10, alignItems: 'center' },
  mailText: { color: '#2F80ED', fontSize: 14, fontWeight: '600' },
});
