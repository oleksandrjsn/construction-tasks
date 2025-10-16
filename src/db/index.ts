import { createRxDatabase } from "rxdb/plugins/core";
import { getRxStorageLocalstorage } from "rxdb/plugins/storage-localstorage";
import { checklistSchema } from "./schemas/checklist.schema";
import { taskSchema } from "./schemas/task.schema";
import { userSchema } from "./schemas/user.schema";
import type { DatabaseCollections, DatabaseType } from "./types";
import { checklistItemSchema } from "./schemas/checklistItem.schema";

let dbInstance: DatabaseType | null = null;

async function initDb() {
  const db = await createRxDatabase<DatabaseCollections>({
    name: "construction_tasks_db",
    storage: getRxStorageLocalstorage(),
  });

  await db.addCollections({
    users: { schema: userSchema },
    tasks: { schema: taskSchema },
    checklists: { schema: checklistSchema },
    checklistItems: { schema: checklistItemSchema },
  });

  dbInstance = db;

  return dbInstance;
}

export async function getDb() {
  if (dbInstance) {
    return dbInstance;
  }

  return initDb();
}
