import {
  createRxDatabase,
  deepEqual,
  type RxConflictHandler,
} from "rxdb/plugins/core";
import { getRxStorageLocalstorage } from "rxdb/plugins/storage-localstorage";
import { checklistSchema } from "./schemas/checklist.schema";
import { checklistItemSchema } from "./schemas/checklistItem.schema";
import { taskSchema } from "./schemas/task.schema";
import { userSchema } from "./schemas/user.schema";
import type {
  CollectionDocType,
  DatabaseCollections,
  DatabaseType,
} from "./types";

export class Database {
  private static instance: Database | null = null;
  private db: DatabaseType | null = null;
  private initializing: Promise<DatabaseType> | null = null;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async init(): Promise<DatabaseType> {
    if (this.db) return this.db;
    if (this.initializing) return this.initializing;

    this.initializing = (async () => {
      const db = await createRxDatabase<DatabaseCollections>({
        name: "construction_tasks_db",
        storage: getRxStorageLocalstorage(),
      });

      await db.addCollections({
        users: { schema: userSchema, conflictHandler: this.conflictHandler },
        tasks: { schema: taskSchema, conflictHandler: this.conflictHandler },
        checklists: {
          schema: checklistSchema,
          conflictHandler: this.conflictHandler,
        },
        checklistItems: {
          schema: checklistItemSchema,
          conflictHandler: this.conflictHandler,
        },
      });

      this.db = db;
      this.initializing = null;
      return db;
    })();

    return this.initializing;
  }

  private conflictHandler: RxConflictHandler<CollectionDocType> = {
    isEqual: (a, b) => deepEqual(a, b),
    resolve: async ({ newDocumentState, realMasterState }) => {
      // Newer document wins.
      return newDocumentState.updatedAt > realMasterState.updatedAt
        ? newDocumentState
        : realMasterState;
    },
  };

  get instanceOrNull(): DatabaseType | null {
    return this.db;
  }

  async destroy(): Promise<void> {
    if (this.db) {
      await this.db.remove();
      this.db = null;
    }
  }
}
