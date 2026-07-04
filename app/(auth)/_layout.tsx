import { Redirect, Stack } from 'expo-router';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuthStore } from '@/store/auth.store';

export default function AuthLayout() {
  const status = useAuthStore((s) => s.status);
  const session = useAuthStore((s) => s.session);

  if (status !== 'ready') return <LoadingSpinner fullScreen />;
  if (session) return <Redirect href="/(tabs)/map" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
        animation: 'slide_from_right',
      }}
    />
  );
}
