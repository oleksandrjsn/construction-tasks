import { useMemo } from "react";
import { useDb } from "../../../app/providers/database-provider";
import { createTaskService } from "./factory";

export const useTaskService = () => {
  const { db, isDbReady } = useDb();

  if (!isDbReady || !db) {
    throw new Error("Database is not ready");
  }

  const taskService = useMemo(() => createTaskService(db), [db]);

  return taskService;
};
