import React, { createContext, useEffect, useState } from "react";
import type { DbContextValue, DbProviderProps } from "./types";
import { Database } from "../../../shared/lib/database";

const DbContext = createContext<DbContextValue>({
  db: null,
  isDbReady: false,
  error: null,
});

export const DbProvider: React.FC<DbProviderProps> = ({ children }) => {
  const [db, setDb] = useState<Database["instance"]>(null);
  const [isDbReady, setIsDbReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initDb = async () => {
      try {
        setError(null);
        const database = new Database();
        const dbInstance = await database.init();
        setDb(dbInstance);
        setIsDbReady(true);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to initialize database";
        setError(errorMessage);
        console.error("Database initialization error:", err);
      }
    };

    initDb();
  }, []);

  const contextValue: DbContextValue = {
    db,
    isDbReady,
    error,
  };

  return (
    <DbContext.Provider value={contextValue}>{children}</DbContext.Provider>
  );
};

export default DbContext;
