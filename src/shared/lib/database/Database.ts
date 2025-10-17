import {
  createRxDatabase,
  deepEqual,
  type RxConflictHandler,
} from "rxdb/plugins/core";
import { getRxStorageLocalstorage } from "rxdb/plugins/storage-localstorage";
import type {
  CollectionDocType,
  DatabaseCollections,
  DatabaseType,
} from "./types";
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

    return this.db;
  }

  conflictHandler: RxConflictHandler<CollectionDocType> = {
    isEqual: (oldDoc, newDoc) => {
      return deepEqual(oldDoc, newDoc);
    },
    resolve: (input) => {
      // Newer document wins.
      const { newDocumentState, realMasterState } = input;
      const result =
        newDocumentState.updatedAt > realMasterState.updatedAt
          ? newDocumentState
          : realMasterState;
      return Promise.resolve(result);
    },
  };

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
