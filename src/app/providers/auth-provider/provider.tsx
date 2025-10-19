import { useCallback, useEffect, useState } from "react";
import type { AuthContextValue, AuthProviderProps } from "./types";
import { useUserService } from "../../../entities/user/api/useUserService";
import { FullscreenLoader } from "../../../shared/ui";
import { AuthContext } from "./context";

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthContextValue["user"]>(null);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [isRequestCompleted, setIsRequestCompleted] = useState(false);

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

  const getProfile = useCallback(async () => {
    setIsRequestPending(true);
    const profile = await userService.getProfile();
    setIsRequestCompleted(true);
    setUser(profile);
    return profile;
  }, [userService]);

  useEffect(() => {
    if (isRequestPending) return;
    getProfile();
  }, [getProfile, isRequestPending]);

  const contextValue: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    getProfile,
  };

  if (!isRequestCompleted) {
    return <FullscreenLoader text="Checking authentication..." />;
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
