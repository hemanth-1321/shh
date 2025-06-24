import { create } from "zustand";

export const useAuthStore = create((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  login: (token: string, user: string) => {
    localStorage.setItem("token", token);
    set({ token, user, isAuthenticated: true });
  },
  logout: (token: string) => {
    localStorage.removeItem("token");
    set({ token: null, user: null, isAuthenticated: false });
  },
  loadTokenFromStorage: () => {
    const token = localStorage.getItem("token");
    if (token) {
      set({ token, isAuthenticated: true });
    }
  },
}));
