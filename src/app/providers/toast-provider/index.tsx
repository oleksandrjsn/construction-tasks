import React, { useEffect } from "react";
import { useToastStore } from "../../store";
import { globalErrorHandler } from "../../../shared/lib/errors/GlobalErrorHandler";
import { ToastContainer } from "../../../shared/ui";

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
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

  return (
    <>
      {children} <ToastContainer />
    </>
  );
};
