import { useMemo } from "react";
import { useDb } from "../../../app/providers/database-provider";
import { createChecklistService } from "./factory";

export const useChecklistService = () => {
  const { db, isDbReady } = useDb();

  if (!isDbReady || !db) {
    throw new Error("Database is not ready");
  }

  const checklistService = useMemo(() => createChecklistService(db), [db]);

  return checklistService;
};
