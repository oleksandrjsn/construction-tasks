import { useEffect, useState } from "react";
import { useChecklistService } from "../api/useChecklistService";
import type { ChecklistItemModel } from "./types";

export const useChecklistItems = (
  userId?: string,
  taskId?: string,
  checklistId?: string
) => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItemModel[]>(
    []
  );
  const checklistService = useChecklistService();

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
