import { create } from "zustand";

interface AuthState {
  token: string | null;
  user: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: string, userId: string) => void;
  logout: () => void;
  loadTokenFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  userId: null,
  isAuthenticated: false,

  login: (token, user, userId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", user);
    localStorage.setItem("userId", userId);

    console.log("received token", token);
    console.log("received user", user);
    console.log("received userId", userId);

    set({ token, user, userId, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    set({ token: null, user: null, userId: null, isAuthenticated: false });
  },

  loadTokenFromStorage: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const userId = localStorage.getItem("userId");

    if (token && user && userId) {
      set({ token, user, userId, isAuthenticated: true });
    }
  },
}));
