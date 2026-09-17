import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#2F80ED',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { minHeight: 60 },
      }}
    >
      <Tabs.Screen name="itinerary" options={{ title: 'Itinerary', tabBarLabel: 'Itinerary' }} />
      <Tabs.Screen name="schedule" options={{ title: 'Schedule', tabBarLabel: 'Schedule' }} />
      <Tabs.Screen name="documents" options={{ title: 'Documents', tabBarLabel: 'Documents' }} />
      <Tabs.Screen name="contacts" options={{ title: 'Contacts', tabBarLabel: 'Contacts' }} />
      <Tabs.Screen name="updates" options={{ title: 'Updates', tabBarLabel: 'Updates' }} />
    </Tabs>
  );
}
