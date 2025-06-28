import { create } from "zustand";


export const useAuthStore = create((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  login: (token: string, user: string, userId: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", user);
    localStorage.setItem("userId", userId);
    console.log("received token", token);
    console.log("received user", user);
    set({ token, user, isAuthenticated: true, userId });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
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
