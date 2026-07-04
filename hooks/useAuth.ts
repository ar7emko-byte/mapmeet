import { useAuthStore } from '@/store/auth.store';

/** Thin selector so screens don't couple to Zustand internals. */
export function useAuth() {
  return useAuthStore((s) => ({
    session: s.session,
    profile: s.profile,
    status: s.status,
    isAuthenticated: !!s.session,
    signOut: s.signOut,
  }));
}
