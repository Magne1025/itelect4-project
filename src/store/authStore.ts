import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Auth state shape — typed interface required by GT2 spec. */
export interface AuthState {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      login: (token: string) => set({ token }),
      logout: () => set({ token: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token }),
    }
  )
);
