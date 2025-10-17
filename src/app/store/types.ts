import type {
  TaskResponse,
  TaskWithChecklistsResponse,
} from "../../entities/task/model";
import type { UserResponse } from "../../entities/user";

export interface AppState {
  currentUser: UserResponse | null;
  isLoggedIn: boolean;
  tasks: TaskResponse[];
  taskDetails: TaskWithChecklistsResponse | null;

  setCurrentUser: (user: UserResponse | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setTasks: (tasks: TaskResponse[]) => void;
  setTaskDetails: (taskDetails: TaskWithChecklistsResponse | null) => void;
  clearState: () => void;
}
