import React, { createContext, useEffect, useState } from "react";
import type { DbContextValue, DbProviderProps } from "./types";
import { Database, type DatabaseType } from "../../../shared/lib/database";
import { globalErrorHandler } from "../../../shared/lib/errors/GlobalErrorHandler";

const DbContext = createContext<DbContextValue>({
  db: null,
  isDbReady: false,
});

export const DbProvider: React.FC<DbProviderProps> = ({ children }) => {
  const [db, setDb] = useState<DatabaseType | null>(null);
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    let databaseInstance: DatabaseType | null = null;

    const initDb = async () => {
      return globalErrorHandler.wrapAsync(async () => {
        try {
          const database = await Database.getInstance().init();
          databaseInstance = database;
          setDb(databaseInstance);
          setIsDbReady(true);
        } catch (err) {
          if (import.meta.env.DEV) {
            console.debug("Database initialization error:", err);
          }
          throw err;
        }
      });
    };

    initDb();

    return () => {
      Database.getInstance()
        .destroy()
        .catch((err) => {
          console.error("Error destroying database:", err);
        });
    };
  }, []);

  const contextValue: DbContextValue = {
    db,
    isDbReady,
  };

  return (
    <DbContext.Provider value={contextValue}>{children}</DbContext.Provider>
  );
};

export default DbContext;
