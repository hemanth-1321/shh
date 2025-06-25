import { create } from "zustand";

export const useAuthStore = create((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  login: (token: string, user: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", user);
    console.log("received token", token);
    console.log("received user", user);
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null, isAuthenticated: false });
  },

  loadTokenFromStorage: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      set({ token, user, isAuthenticated: true });
    }
  },
}));
