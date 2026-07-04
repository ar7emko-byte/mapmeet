import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useEventsBootstrap } from '@/features/events/useEventsBootstrap';
import { useAuthStore } from '@/store/auth.store';

export default function TabsLayout() {
  const scheme = useColorScheme() ?? 'light';
  const status = useAuthStore((s) => s.status);
  const session = useAuthStore((s) => s.session);
  const isDark = scheme === 'dark';

  // Kicks off the initial fetch + realtime subscription for the whole
  // authenticated shell. Unmounts on sign-out (see the store's reset()).
  useEventsBootstrap();

  if (status !== 'ready') return <LoadingSpinner fullScreen />;
  if (!session) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3757FF',
        tabBarInactiveTintColor: isDark ? '#8A8A94' : '#8E8E93',
        tabBarStyle: {
          backgroundColor: isDark ? '#0B0B0FEE' : '#FFFFFFEE',
          borderTopColor: isDark ? '#2A2A32' : '#E5E5EA',
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'My Events',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
