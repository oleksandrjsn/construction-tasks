import { DbProvider } from "./database-provider";
import { ErrorProvider } from "./error-provider";

export const withProviders = (Component: React.ComponentType) => {
  return () => (
    <ErrorProvider>
      <DbProvider>
        <Component />
      </DbProvider>
    </ErrorProvider>
  );
};
