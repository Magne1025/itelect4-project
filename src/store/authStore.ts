import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ApiUser } from "../types/index";

export interface AuthState {
  token: string | null;
  userName: string | null;
  user: ApiUser | null;
  setSession: (token: string, userName: string, user?: ApiUser) => void;
  login: (token: string, user: ApiUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userName: null,
      user: null,
      setSession: (token: string, userName: string, user?: ApiUser) =>
        set({
          token,
          userName,
          user: user ?? { id: "", name: userName, email: "", role: "student" as any, isActive: true },
        }),
      login: (token: string, user: ApiUser) =>
        set({ token, userName: user.name, user }),
      logout: () => set({ token: null, userName: null, user: null }),
    }),
    {
      name: "itelect4-auth",
      partialize: (state) => ({
        token: state.token,
        userName: state.userName,
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;
