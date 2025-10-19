import { useAppStore } from "../../../app/store";
import { useUserService } from "../api/useUserService";

export const useAuth = () => {
  const { currentUser, clearState, isLoggedIn, setCurrentUser, setIsLoggedIn } =
    useAppStore();
  const userService = useUserService();

  const login = async (name: string) => {
    const user = await userService.login(name);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
    }
    return user;
  };

  const logout = async () => {
    await userService.logout();
    clearState();
  };

  const getProfile = async () => {
    try {
      const user = await userService.getProfile();
      if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
      }
      return user;
    } catch (error) {
      setCurrentUser(null);
      setIsLoggedIn(false);
      throw error;
    }
  };

  return {
    user: currentUser,
    isLoggedIn,
    login,
    logout,
    getProfile,
  };
};
