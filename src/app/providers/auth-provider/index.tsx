import { useEffect, useRef } from "react";
import { useAuth } from "../../../entities/user/model/useAuth";
import { FullscreenLoader } from "../../../shared/ui";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isReady = useRef(false);
  const { getProfile } = useAuth();

  useEffect(() => {
    if (isReady.current) {
      return;
    }
    const initAuth = async () => {
      try {
        await getProfile();
      } finally {
        isReady.current = true;
      }
    };

    initAuth();
  }, [getProfile]);

  if (!isReady) {
    return <FullscreenLoader text="Checking authentication..." />;
  }

  return <>{children}</>;
}
