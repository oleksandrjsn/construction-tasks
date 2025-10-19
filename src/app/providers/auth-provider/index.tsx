import { useEffect, useRef } from "react";
import { useAuth } from "../../../entities/user/model/useAuth";
import { useAppStore } from "../../store";
import { FullscreenLoader } from "../../../shared/ui";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isReady = useRef(false);
  const { setCurrentUser, setIsLoggedIn } = useAppStore();
  const { getProfile } = useAuth();

  useEffect(() => {
    if (isReady.current) {
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
        isReady.current = true;
      }
    };

    initAuth();
  }, [getProfile, setCurrentUser, setIsLoggedIn]);

  if (!isReady) {
    return <FullscreenLoader text="Checking authentication..." />;
  }

  return <>{children}</>;
}
