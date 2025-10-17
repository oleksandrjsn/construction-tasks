import { create } from "zustand";
import type { AppState } from "./types";

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  isLoggedIn: false,
  tasks: [],
  taskDetails: null,

  setCurrentUser: (user) => set({ currentUser: user }),
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  setTasks: (tasks) => set({ tasks }),
  setTaskDetails: (taskDetails) => set({ taskDetails }),

  clearState: () =>
    set({
      currentUser: null,
      isLoggedIn: false,
      tasks: [],
      taskDetails: null,
    }),
}));
