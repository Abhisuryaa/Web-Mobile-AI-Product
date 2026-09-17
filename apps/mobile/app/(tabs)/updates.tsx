import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, StyleSheet, Text, View, useColorScheme } from 'react-native';
import * as Notifications from 'expo-notifications';
import { getUpdates } from '../../lib/api';
import { useTrip } from '../../lib/TripContext';
import type { TripUpdate } from '../../lib/types';
import { UpdateItem } from '../../components/UpdateItem';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function registerForPush(): Promise<string | null> {
  try {
    if (Platform.OS === 'web') return null;
    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== 'granted') {
      const req = await Notifications.requestPermissionsAsync();
      finalStatus = req.status;
    }
    if (finalStatus !== 'granted') return null;
    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  } catch {
    // Expo Go / simulator safe: never hard-crash on push registration
    return null;
  }
}

export default function UpdatesScreen() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const { selectedTripId } = useTrip();
  const [updates, setUpdates] = useState<TripUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [pushToken, setPushToken] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!selectedTripId) {
      setLoading(false);
      return;
    }
    const data = await getUpdates(selectedTripId);
    setUpdates([...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    setLoading(false);
  }, [selectedTripId]);

  useEffect(() => {
    registerForPush().then(setPushToken);
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, [load]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: dark ? '#0B1D33' : '#fff' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: dark ? '#0B1D33' : '#F8FAFC' }]}>
      <Text style={[styles.heading, { color: dark ? '#fff' : '#0B1D33' }]}>Live updates</Text>
      <Text style={[styles.sub, { color: dark ? '#B8C4D6' : '#4B5563' }]}>
        Refreshes every 15s. {pushToken ? 'Push enabled ✓' : 'Push unavailable (offline or Expo Go) — polling instead.'}
      </Text>
      <FlatList
        data={updates}
        keyExtractor={(u) => u.id}
        renderItem={({ item }) => <UpdateItem update={item} />}
        ListEmptyComponent={<Text style={{ color: dark ? '#fff' : '#111827' }}>No updates yet. You’re all set.</Text>}
        contentContainerStyle={{ paddingBottom: 32 }}
        onRefresh={load}
        refreshing={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heading: { fontSize: 22, fontWeight: '800' },
  sub: { fontSize: 13, marginTop: 4, marginBottom: 8, lineHeight: 18 },
});
