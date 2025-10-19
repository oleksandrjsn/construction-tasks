import { useAppStore } from "../../../app/store";
import { useUserService } from "../api/useUserService";

export const useAuth = () => {
  const { currentUser, clearState, isLoggedIn, setCurrentUser } = useAppStore();
  const userService = useUserService();

  const login = async (name: string) => {
    const user = await userService.login(name);
    if (user) {
      setCurrentUser(user);
    }
    return user;
  };

  const logout = async () => {
    await userService.logout();
    clearState();
  };

  return {
    user: currentUser,
    isLoggedIn,
    login,
    logout,
    getProfile: userService.getProfile,
  };
};
