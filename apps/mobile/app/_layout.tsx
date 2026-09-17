import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TripProvider } from '../lib/TripContext';

export default function RootLayout() {
  return (
    <TripProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="trip/[id]" options={{ headerShown: true, title: 'Trip detail' }} />
      </Stack>
    </TripProvider>
  );
}
