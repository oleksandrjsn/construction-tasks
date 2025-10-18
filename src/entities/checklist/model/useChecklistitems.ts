import { useEffect, useMemo, useState } from "react";
import type { ChecklistItemModel } from "./types";
import { useDb } from "../../../app/providers/database-provider";
import { createChecklistService } from "../api";

export const useChecklistItems = (
  userId?: string,
  taskId?: string,
  checklistId?: string
) => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItemModel[]>(
    []
  );
  const { db, isDbReady } = useDb();

  if (!isDbReady || !db) {
    throw new Error("Database is not ready");
  }

  const checklistService = useMemo(() => createChecklistService(db), [db]);

  useEffect(() => {
    if (!checklistService || !userId || !taskId || !checklistId) {
      return;
    }

    const subscription = checklistService
      .subscribeToChecklistItems(userId, checklistId)
      .subscribe(async (fetchedItems) => {
        const resolvedItems = await Promise.all(fetchedItems);
        setChecklistItems(resolvedItems);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [checklistService, checklistId, userId, taskId]);

  return {
    checklistItems,
    createChecklistItem: checklistService.createChecklistItem,
    updateChecklistItem: checklistService.updateChecklistItem,
    deleteChecklistItem: checklistService.deleteChecklistItem,
  };
};
