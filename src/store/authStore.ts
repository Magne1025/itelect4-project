import { create } from "zustand";

/** Auth state shape — typed interface required by GT2 spec. */
export interface AuthState {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,

  login: (token: string) => set({ token }),

  logout: () => set({ token: null }),
}));
