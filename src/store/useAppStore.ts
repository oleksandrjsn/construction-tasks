import { create } from "zustand";
import { TaskService } from "../services/task.service";
import { UserService } from "../services/user.service";
import type { AppState } from "./types";

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  isLoggedIn: false,
  tasks: [],
  taskDetails: null,

  async login(username) {
    try {
      const user = await UserService.findOrCreateUser(username);
      set({ currentUser: user, isLoggedIn: true });
      get().loadUserData();
    } catch (error) {
      // TODO: add logger and report error
      console.error("Login error:", error);
    }
  },

  logout() {
    set({
      currentUser: null,
      isLoggedIn: false,
      tasks: [],
      taskDetails: null,
    });
  },

  async createTask(task) {
    const newTask = await TaskService.createTask(task);
    set((state) => ({
      tasks: [...state.tasks, newTask],
    }));
  },

  async loadUserData() {
    const user = get().currentUser;
    if (!user) return;

    try {
      const tasks = await TaskService.getTasks(user.id);
      set({ tasks });
    } catch (error) {
      // TODO: add logger and report error
      console.error("Login error:", error);
    }
  },

  async loadTaskDetails(taskId) {
    const user = get().currentUser;
    if (!user) return;

    try {
      const taskDetails = await TaskService.getTask(user.id, taskId);
      set({ taskDetails });
    } catch (error) {
      // TODO: add logger and report error
      console.error("Load task details error:", error);
    }
  },
}));

/* 
TODO: should I subscribe to changes in the DB and update the store accordingly?
import { from } from 'rxjs';

loadTasks: async () => {
  const db = await getDb();
  from(db.tasks.find().$).subscribe((tasks) => {
    set({ tasks: tasks.map(t => t.toJSON()) });
  });
},
If so method should be implemented in DB service, not here.
*/
