import type { DatabaseType } from "../../../shared/lib";

export interface DbContextValue {
  db: DatabaseType | null;
  isDbReady: boolean;
  error: string | null;
}

export interface DbProviderProps {
  children: React.ReactNode;
}
