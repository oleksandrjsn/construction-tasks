import { create } from "zustand";
import type { AppState } from "./types";

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  isLoggedIn: false,
  isLoading: false,

  setCurrentUser: (user) => set({ currentUser: user }),
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  setIsLoading: (isLoading) => set({ isLoading }),

  clearState: () =>
    set({
      currentUser: null,
      isLoggedIn: false,
      isLoading: false,
    }),
}));
