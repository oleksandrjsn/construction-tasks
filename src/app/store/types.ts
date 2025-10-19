import type { UserResponse } from "../../entities/user";

export interface AppState {
  currentUser: UserResponse | null;
  isLoggedIn: boolean;
  isLoading: boolean;

  setCurrentUser: (user: UserResponse | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  clearState: () => void;
}
