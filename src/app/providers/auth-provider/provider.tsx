import { useEffect, useState } from "react";
import type { AuthContextValue, AuthProviderProps } from "./types";
import { useUserService } from "../../../entities/user/api/useUserService";
import { FullscreenLoader } from "../../../shared/ui";
import { AuthContext } from "./context";

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthContextValue["user"]>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const userService = useUserService();

  const login = async (name: string) => {
    const loggedInUser = await userService.login(name);
    if (loggedInUser) {
      setUser(loggedInUser);
    }
    return loggedInUser;
  };

  const logout = async () => {
    await userService.logout();
    setUser(null);
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        await userService.getProfile();
      } finally {
        if (mounted) setIsInitializing(false);
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, [userService]);

  const contextValue: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  if (isInitializing) {
    return <FullscreenLoader text="Checking authentication..." />;
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
