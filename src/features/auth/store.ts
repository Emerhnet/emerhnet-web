import { create } from "zustand";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: "superAdmin" | "hospitalAdmin";
  hospitalId?: string | null;
  status?: "active" | "locked" | "pendingPasswordSet";
  mustChangePassword?: boolean;
};

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isBootstrapped: boolean;
  setUser: (user: AuthUser) => void;
  setBootstrapped: (value: boolean) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isBootstrapped: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  setBootstrapped: (value) => set({ isBootstrapped: value }),
  clear: () => set({ user: null, isAuthenticated: false }),
}));
