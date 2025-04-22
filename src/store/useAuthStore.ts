//사용자 인증·프로필 상태

import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  session: Session | null;
  user: User | null;
  setSession: (session: Session | null) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      user: null,

      setSession: (session) => {
        set({
          session,
          user: session?.user ?? null,
        });
      },

      clearSession: () => {
        set({ session: null, user: null });
      },
    }),
    {
      name: "auth-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // 저장할 값만
        session: state.session,
        user: state.user,
      }),
    }
  )
);
