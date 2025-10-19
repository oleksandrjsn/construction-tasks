import { useEffect, useState } from "react";
import type { TaskModel } from ".";
import { useTaskService } from "../api/useTaskService";

export const useTasks = (userId?: string) => {
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const taskService = useTaskService();

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
