import type { RxCollection, RxDatabase } from "rxdb";
import type { ChecklistDocType } from "./schemas/checklist.schema";
import type { TaskDocType } from "./schemas/task.schema";
import type { UserDocType } from "./schemas/user.schema";
import type { ChecklistItemDocType } from "./schemas/checklistItem.schema";

export type DatabaseCollections = {
  users: RxCollection<UserDocType>;
  tasks: RxCollection<TaskDocType>;
  checklists: RxCollection<ChecklistDocType>;
  checklistItems: RxCollection<ChecklistItemDocType>;
};

export type DatabaseType = RxDatabase<DatabaseCollections>;
