import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../../shared/ui";
import { AuthProvider } from "./auth-provider";
import { DbProvider } from "./database-provider";
import { ToastProvider } from "./toast-provider";

export const withProviders = (Component: React.ComponentType) => {
  return () => (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <DbProvider>
        <ToastProvider>
          <AuthProvider>
            <Component />
          </AuthProvider>
        </ToastProvider>
      </DbProvider>
    </ErrorBoundary>
  );
};
