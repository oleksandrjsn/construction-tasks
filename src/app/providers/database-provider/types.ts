import type { DatabaseType } from "../../../shared/lib/database";

export interface DbContextValue {
  db: DatabaseType | null;
  isDbReady: boolean;
}

export interface DbProviderProps {
  children: React.ReactNode;
}
