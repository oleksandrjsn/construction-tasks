import { TaskService } from "./service";
import type { DatabaseType } from "../../../shared/lib/database";
import { TaskRepository } from "./repository";
import { ChecklistItemRepository, ChecklistRepository } from "../../checklist";

export function createTaskService(db: DatabaseType): TaskService {
  const taskRepository = new TaskRepository(db);
  const checklistRepository = new ChecklistRepository(db);
  const checklistItemRepository = new ChecklistItemRepository(db);

  const service = new TaskService(
    taskRepository,
    checklistRepository,
    checklistItemRepository
  );

  return service;
}
