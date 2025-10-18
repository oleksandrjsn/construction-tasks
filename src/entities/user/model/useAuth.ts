import { useMemo } from "react";
import { useDb } from "../../../app/providers/database-provider";
import { createUserService } from "../api/factory";

export const useAuth = () => {
  const { db, isDbReady } = useDb();

  if (!isDbReady || !db) {
    throw new Error("Database is not ready");
  }

  return useMemo(() => createUserService(db), [db]);
};
