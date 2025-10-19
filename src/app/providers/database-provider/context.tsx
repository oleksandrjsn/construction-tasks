import { createContext, useEffect, useState } from "react";
import { Database, type DatabaseType } from "../../../shared/lib/database";
import type { DbContextValue, DbProviderProps } from "./types";
import { FullscreenLoader } from "../../../shared/ui";

const DbContext = createContext<DbContextValue>({
  db: null,
  isDbReady: false,
});

export const DbProvider = ({ children }: DbProviderProps) => {
  const [db, setDb] = useState<DatabaseType | null>(null);
  const [isDbReady, setIsDbReady] = useState(false);
  const [isDbLoading, setIsDbLoading] = useState(true);

  useEffect(() => {
    const initDb = async () => {
      setIsDbLoading(true);
      try {
        const database = await Database.getInstance().init();
        setDb(database);
        setIsDbReady(true);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.debug("Database initialization error:", err);
        }
        throw err;
      } finally {
        setIsDbLoading(false);
      }
    };

    initDb();
  }, []);

  const contextValue: DbContextValue = {
    db,
    isDbReady,
  };

  if (isDbLoading) {
    return <FullscreenLoader text="Loading database..." />;
  }

  if (!isDbLoading && !isDbReady) {
    throw new Error("Failed to initialize the database");
  }

  return (
    <DbContext.Provider value={contextValue}>{children}</DbContext.Provider>
  );
};

export default DbContext;
