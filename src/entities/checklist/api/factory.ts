import type { DatabaseType } from "../../../shared/lib/database";
import { ChecklistItemRepository } from "./checklist-item-repository";
import { ChecklistRepository } from "./checklist-repository";
import { ChecklistService } from "./service";

export function createChecklistService(db: DatabaseType): ChecklistService {
  const checklistRepository = new ChecklistRepository(db);
  const checklistItemRepository = new ChecklistItemRepository(db);

  const service = new ChecklistService(
    checklistRepository,
    checklistItemRepository
  );

  return service;
}
