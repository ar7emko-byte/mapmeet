import type { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

import { authService } from '@/services/auth.service';
import { profilesService } from '@/services/profiles.service';
import type { Profile } from '@/types';

type AuthState = {
  session: Session | null;
  profile: Profile | null;
  status: 'idle' | 'loading' | 'ready';
  bootstrap: () => Promise<void>;
  signOut: () => Promise<void>;
  setSession: (session: Session | null) => Promise<void>;
  setProfile: (profile: Profile) => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  profile: null,
  status: 'idle',

  bootstrap: async () => {
    if (get().status !== 'idle') return;
    set({ status: 'loading' });
    const session = await authService.getSession();
    await get().setSession(session);
    // Subscribe once — the returned handle is intentionally leaked for the
    // life of the process. Re-mounting would create duplicate listeners.
    authService.onAuthStateChange((next) => {
      void get().setSession(next);
    });
    set({ status: 'ready' });
  },

  setSession: async (session) => {
    if (!session) {
      set({ session: null, profile: null });
      return;
    }
    const profile = await profilesService.getById(session.user.id);
    set({ session, profile });
  },

  signOut: async () => {
    await authService.signOut();
    set({ session: null, profile: null });
  },

  setProfile: (profile) => set({ profile }),
}));
