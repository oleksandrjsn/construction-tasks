interface UserModel {
  id: string;
  name: string;
}

export interface AuthContextValue {
  user: UserModel | null;
  isAuthenticated: boolean;
  login: (name: string) => Promise<UserModel | null>;
  logout: () => Promise<void>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
