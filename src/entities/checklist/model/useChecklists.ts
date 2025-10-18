import { useEffect, useMemo, useState } from "react";
import type { ChecklistModel } from "./types";
import { useDb } from "../../../app/providers/database-provider";
import { createChecklistService } from "../api";

export const useChecklists = (userId?: string, taskId?: string) => {
  const [checklists, setChecklists] = useState<ChecklistModel[]>([]);
  const { db, isDbReady } = useDb();

  if (!isDbReady || !db) {
    throw new Error("Database is not ready");
  }

  const checklistService = useMemo(() => createChecklistService(db), [db]);

  useEffect(() => {
    if (!checklistService || !userId || !taskId) {
      return;
    }

    const subscription = checklistService
      .subscribeToUserChecklists(userId, taskId)
      .subscribe(async (fetchedTasks) => {
        const resolvedTasks = await Promise.all(fetchedTasks);
        setChecklists(resolvedTasks);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [checklistService, userId, taskId]);

  return {
    checklists,
    createChecklist: checklistService.createChecklist,
    updateChecklist: checklistService.updateChecklist,
    deleteChecklist: checklistService.deleteChecklist,
    createChecklistItem: checklistService.createChecklistItem,
    updateChecklistItem: checklistService.updateChecklistItem,
    deleteChecklistItem: checklistService.deleteChecklistItem,
  };
};
