import type { UserResponse } from "../../entities/user";

export interface AppState {
  currentUser: UserResponse | null;
  isInitialized: boolean;
  isLoggedIn: boolean;
  isLoading: boolean;
  selectedTaskId: string | null;

  setCurrentUser: (user: UserResponse | null) => void;
  setIsInitialized: (isInitialized: boolean) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSelectedTaskId: (taskId: string | null) => void;
  clearState: () => void;
}
