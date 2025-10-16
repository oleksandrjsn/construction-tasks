import type { ChecklistItemDocType } from "../db/schemas/checklistItem.schema";
import type { ChecklistItemResponse } from "./types";

export const getChecklistItem = (
  entity: ChecklistItemDocType
): ChecklistItemResponse => ({
  id: entity.id!,
  title: entity.title,
  status: entity.status,
  checklistId: entity.checklistId,
  statusMessage: entity.statusMessage,
});
