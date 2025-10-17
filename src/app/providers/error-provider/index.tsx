import React, { useEffect } from "react";
import { useToastStore } from "../../store";
import { globalErrorHandler } from "../../../shared/lib/errors/GlobalErrorHandler";

interface ErrorProviderProps {
  children: React.ReactNode;
}

export const ErrorProvider = ({ children }: ErrorProviderProps) => {
  const { showError } = useToastStore();

  useEffect(() => {
    const interceptor = {
      onError: (error: Error) => {
        showError(error);
      },
    };

    globalErrorHandler.addInterceptor(interceptor);

    return () => {
      globalErrorHandler.removeInterceptor(interceptor);
    };
  }, [showError]);

  return <>{children}</>;
};
