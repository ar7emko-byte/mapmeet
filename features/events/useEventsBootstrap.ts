import { useEffect } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useEventsStore } from '@/store/events.store';

/** Fetches the events feed and opens a realtime subscription whenever the
 *  authenticated user changes. Mount from the (tabs) layout so the sub only
 *  lives while a session exists. */
export function useEventsBootstrap() {
  const { session } = useAuth();
  const viewerId = session?.user.id ?? null;
  const fetch = useEventsStore((s) => s.fetch);
  const subscribe = useEventsStore((s) => s.subscribe);
  const reset = useEventsStore((s) => s.reset);

  useEffect(() => {
    if (!viewerId) {
      reset();
      return;
    }
    void fetch(viewerId);
    const unsubscribe = subscribe(viewerId);
    return () => {
      unsubscribe();
    };
  }, [viewerId, fetch, subscribe, reset]);
}
