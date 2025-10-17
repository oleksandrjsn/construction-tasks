import { create } from "zustand";
import type { AppState } from "./types";

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  isLoggedIn: false,
  isLoading: false,
  selectedTaskId: null,
  isInitialized: false,

  setCurrentUser: (user) => set({ currentUser: user }),
  setIsInitialized: (isInitialized) => set({ isInitialized }),
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setSelectedTaskId: (taskId) => set({ selectedTaskId: taskId }),

  clearState: () =>
    set({
      currentUser: null,
      isLoggedIn: false,
      isLoading: false,
      selectedTaskId: null,
    }),
}));
