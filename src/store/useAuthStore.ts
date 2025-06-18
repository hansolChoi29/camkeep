import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Session, User } from "@supabase/supabase-js";

interface AuthState {
  session: Session | null;
  user: User | null;
  setSession(session: Session | null): void;
  clearSession(): void;
  // 모바일 헤더전용
  isLoggedIn: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      user: null,
      setSession: (session) => set({ session, user: session?.user ?? null }),
      clearSession: () => set({ session: null, user: null }),
      isLoggedIn: false,
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ session: state.session, user: state.user }),
    }
  )
);

useAuthStore.subscribe((state: AuthState, prevState?: AuthState) => {
  if (state.session !== prevState?.session) {
    useAuthStore.setState({ isLoggedIn: state.session !== null });
  }
});
