import { useEffect } from "react";
import { useAuth } from "../../../entities/user/model/useAuth";
import { useAppStore } from "../../store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isInitialized, setCurrentUser, setIsLoggedIn, setIsInitialized } =
    useAppStore();
  const { getProfile } = useAuth();

  useEffect(() => {
    if (isInitialized) {
      return;
    }
    const initAuth = async () => {
      try {
        const user = await getProfile();
        if (user) {
          setCurrentUser(user);
          setIsLoggedIn(true);
        } else {
          setCurrentUser(null);
          setIsLoggedIn(false);
        }
      } catch {
        /* getProfile method already handles errors */
        setCurrentUser(null);
        setIsLoggedIn(false);
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();
  }, [
    getProfile,
    isInitialized,
    setCurrentUser,
    setIsInitialized,
    setIsLoggedIn,
  ]);

  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
}
