import { useMemo } from "react";
import { useDb } from "../../../app/providers/database-provider";
import { createUserService } from "./factory";

export const useUserService = () => {
  const { db, isDbReady } = useDb();

  if (!isDbReady || !db) {
    throw new Error("Database is not ready");
  }

  return useMemo(() => createUserService(db), [db]);
};
