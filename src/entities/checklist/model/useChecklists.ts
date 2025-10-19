import { useEffect, useState } from "react";
import type { ChecklistModel } from "./types";
import { useChecklistService } from "../api/useChecklistService";

export const useChecklists = (userId?: string, taskId?: string) => {
  const [checklists, setChecklists] = useState<ChecklistModel[]>([]);
  const checklistService = useChecklistService();

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
