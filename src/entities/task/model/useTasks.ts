import { useEffect, useMemo, useState } from "react";
import type { TaskModel } from ".";
import { useDb } from "../../../app/providers/database-provider";
import { createTaskService } from "../api";

export const useTasks = (userId?: string) => {
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const { db, isDbReady } = useDb();

  if (!isDbReady || !db) {
    throw new Error("Database is not ready");
  }

  const taskService = useMemo(() => createTaskService(db), [db]);

  useEffect(() => {
    if (!taskService || !userId) {
      return;
    }

    const subscription = taskService
      .subscribeToUserTasks(userId)
      .subscribe(async (fetchedTasks) => {
        const resolvedTasks = await Promise.all(fetchedTasks);
        setTasks(resolvedTasks);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [taskService, userId]);

  return {
    tasks,
    createTask: taskService.createTask,
    updateTask: taskService.updateTask,
    deleteTask: taskService.deleteTask,
  };
};
