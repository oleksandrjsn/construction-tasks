import { ToastContainer } from "../../shared/ui/toast";
import { AuthProvider } from "./auth-provider";
import { DbProvider } from "./database-provider";
import { ErrorProvider } from "./error-provider";

export const withProviders = (Component: React.ComponentType) => {
  return () => (
    <ErrorProvider>
      <DbProvider>
        <AuthProvider>
          <Component />
          <ToastContainer />
        </AuthProvider>
      </DbProvider>
    </ErrorProvider>
  );
};
