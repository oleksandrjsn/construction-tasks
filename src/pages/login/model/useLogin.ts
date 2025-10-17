import { useMemo } from "react";
import { useDb } from "../../../app/providers/database-provider";
import { useAppStore } from "../../../app/store";
import { UserRepository, UserService } from "../../../entities/user";

export const useLogin = () => {
  const { db, isDbReady, error } = useDb();
  const { setCurrentUser, setIsLoggedIn } = useAppStore();

  const userService = useMemo(() => {
    if (!db) return null;
    const userRepository = new UserRepository(db);
    return new UserService(userRepository);
  }, [db]);

  const login = async (username: string) => {
    if (!userService) throw new Error("Database not ready");

    const user = await userService.login(username);
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  return {
    login,
    isDbReady,
    dbError: error,
  };
};
