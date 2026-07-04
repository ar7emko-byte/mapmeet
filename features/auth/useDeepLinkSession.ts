import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { supabase } from '@/services/supabase';

/** Supabase emails encode auth data in the URL fragment
 *  (`#access_token=…&refresh_token=…&type=recovery`). Web picks that up
 *  automatically via detectSessionInUrl; native has to parse the deep
 *  link ourselves and hand the tokens to supabase.auth.setSession. */
export function useDeepLinkSession() {
  useEffect(() => {
    if (Platform.OS === 'web') return; // detectSessionInUrl handles it

    const handle = async (url: string | null) => {
      if (!url) return;
      const parsed = Linking.parse(url);
      // Supabase writes tokens into the URL fragment. expo-linking exposes
      // `queryParams` for both `?` and `#` in v7+.
      const params = (parsed.queryParams ?? {}) as Record<string, string>;
      const type = params.type;
      const access = params.access_token;
      const refresh = params.refresh_token;
      if (!access || !refresh) return;

      const { error } = await supabase.auth.setSession({
        access_token: access,
        refresh_token: refresh,
      });
      if (error) return;

      if (type === 'recovery') {
        router.replace('/reset');
      } else {
        router.replace('/(tabs)/map');
      }
    };

    // Handle cold-start deep link.
    void Linking.getInitialURL().then(handle);
    // Handle warm-start deep links.
    const sub = Linking.addEventListener('url', ({ url }) => {
      void handle(url);
    });
    return () => sub.remove();
  }, []);
}
