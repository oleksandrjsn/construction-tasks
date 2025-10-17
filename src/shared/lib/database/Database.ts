import { createRxDatabase } from "rxdb/plugins/core";
import { getRxStorageLocalstorage } from "rxdb/plugins/storage-localstorage";
import type { DatabaseCollections, DatabaseType } from "./types";
import { userSchema } from "./schemas/user.schema";
import { taskSchema } from "./schemas/task.schema";
import { checklistSchema } from "./schemas/checklist.schema";
import { checklistItemSchema } from "./schemas/checklistItem.schema";

export class Database {
  private db: DatabaseType | null = null;

  async init(): Promise<DatabaseType> {
    if (this.db) {
      return this.db;
    }

    this.db = await createRxDatabase<DatabaseCollections>({
      name: "construction_tasks_db",
      storage: getRxStorageLocalstorage(),
    });

    await this.db.addCollections({
      users: { schema: userSchema },
      tasks: { schema: taskSchema },
      checklists: { schema: checklistSchema },
      checklistItems: { schema: checklistItemSchema },
    });

    return this.db;
  }

  get instance(): DatabaseType | null {
    return this.db;
  }

  async destroy(): Promise<void> {
    if (this.db) {
      await this.db.remove();
      this.db = null;
    }
  }
}
