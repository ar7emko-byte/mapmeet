import { Redirect } from 'expo-router';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuthStore } from '@/store/auth.store';

/** Entry point. Waits for the auth bootstrap to finish, then routes to
 *  the map (if signed in) or the sign-in screen. */
export default function Index() {
  const status = useAuthStore((s) => s.status);
  const session = useAuthStore((s) => s.session);

  if (status !== 'ready') {
    return <LoadingSpinner fullScreen />;
  }
  return session ? <Redirect href="/(tabs)/map" /> : <Redirect href="/(auth)/login" />;
}
