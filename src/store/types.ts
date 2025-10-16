import type {
  CreateTaskRequest,
  TaskResponse,
  TaskWithChecklistsResponse,
  UserResponse,
} from "../services/types";

export interface AppState {
  currentUser: UserResponse | null;
  isLoggedIn: boolean;
  tasks: TaskResponse[];
  taskDetails: TaskWithChecklistsResponse | null;

  login: (username: string) => Promise<void>;
  logout: () => void;
  createTask: (task: CreateTaskRequest) => Promise<void>;
  loadUserData: () => Promise<void>;
  loadTaskDetails: (taskId: string) => Promise<void>;
}
