import React, { useEffect } from "react";
import { useToastStore } from "../../store";
import type { AppError } from "../../../shared/lib/errors/AppError";
import { globalErrorHandler } from "../../../shared/lib/errors/GlobalErrorHandler";

interface ErrorProviderProps {
  children: React.ReactNode;
}

export const ErrorProvider = ({ children }: ErrorProviderProps) => {
  const { showError } = useToastStore();

  useEffect(() => {
    const interceptor = {
      onError: (error: AppError) => {
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
