import { getDb } from "../db";
import type { ChecklistItemDocType } from "../db/schemas/checklistItem.schema";
import type {
  AddChecklistItemRequest,
  AddChecklistRequest,
  ChecklistItemResponse,
  ChecklistResponse,
  UpdateChecklistItemRequest,
  UpdateChecklistRequest,
} from "./types";
import { getChecklistItem } from "./utils";
import { v4 as uuidv4 } from "uuid";

export class ChecklistService {
  static async getChecklist(
    userId: string,
    taskId: string
  ): Promise<ChecklistResponse | null> {
    const db = await getDb();
    const checklist = await db.checklists
      .findOne({ selector: { taskId, userId } })
      .exec();

    if (!checklist) {
      return null;
    }

    const checklistJson = checklist?.toJSON();

    const items = await db.checklistItems
      .find({ selector: { checklistId: checklistJson.id } })
      .exec();
    const itemsJson = items.map((item) => item.toJSON());

    return {
      id: checklistJson.id,
      title: checklistJson.title,
      taskId: checklistJson.taskId,
      items: itemsJson.map(getChecklistItem),
    };
  }

  static async addChecklist(
    payload: AddChecklistRequest
  ): Promise<ChecklistResponse> {
    const { items, ...checklistData } = payload;
    const db = await getDb();

    const existingChecklist = await db.checklists
      .findOne({
        selector: {
          taskId: checklistData.taskId,
          userId: checklistData.userId,
        },
      })
      .exec();

    if (existingChecklist) {
      throw new Error("Checklist for this task already exists.");
    }

    const newChecklist = await db.checklists.insert({
      ...checklistData,
      id: uuidv4(),
    });
    const checkListJson = newChecklist.toJSON();

    let insertedItems: ChecklistItemDocType[] = [];

    if (items && items.length > 0) {
      const itemsToInsert = items.map((item) => ({
        ...item,
        checklistId: checkListJson.id,
        userId: checklistData.userId,
        status: "not_started" as const,
        id: uuidv4(),
      }));
      // TODO: Handle potential errors in bulkInsert
      const { error, success } = await db.checklistItems.bulkInsert(
        itemsToInsert
      );
      if (error && error.length > 0) {
        console.error("Error inserting checklist items:", error);
      }
      insertedItems = success.map((item) => item.toJSON());
    }

    return {
      id: checkListJson.id,
      title: checkListJson.title,
      taskId: checkListJson.taskId,
      items: insertedItems.map(getChecklistItem),
    };
  }

  static async updateChecklist(
    payload: UpdateChecklistRequest
  ): Promise<ChecklistResponse | null> {
    const { taskId, userId, ...checklistData } = payload;
    const db = await getDb();
    const checklist = await db.checklists
      .findOne({ selector: { taskId, userId } })
      .exec();

    if (!checklist) {
      return null;
    }

    const updatedChecklist = await checklist.patch(checklistData);
    const checklistJson = updatedChecklist.toJSON();

    const items = await db.checklistItems
      .find({ selector: { checklistId: checklistJson.id } })
      .exec();
    const itemsJson = items.map((item) => item.toJSON());

    return {
      id: checklistJson.id,
      title: checklistJson.title,
      taskId: checklistJson.taskId,
      items: itemsJson.map(getChecklistItem),
    };
  }

  static async deleteChecklist(
    userId: string,
    checklistId: string
  ): Promise<void> {
    const db = await getDb();
    const checklist = await db.checklists
      .findOne({ selector: { userId, id: checklistId } })
      .exec();

    if (!checklist) {
      return;
    }

    await checklist.remove();

    await db.checklistItems.find({ selector: { checklistId } }).remove();
  }

  static async addChecklistItem(
    payload: AddChecklistItemRequest
  ): Promise<ChecklistItemResponse> {
    const db = await getDb();
    const checklist = await db.checklists
      .findOne({
        selector: { id: payload.checklistId, userId: payload.userId },
      })
      .exec();

    if (!checklist) {
      throw new Error("Checklist not found");
    }

    const newItem = await db.checklistItems.insert({
      id: uuidv4(),
      title: payload.title,
      checklistId: payload.checklistId,
      userId: payload.userId,
      status: "not_started",
    });

    return getChecklistItem(newItem.toJSON());
  }

  static async updateChecklistItem(
    payload: UpdateChecklistItemRequest
  ): Promise<ChecklistItemResponse | null> {
    const { id, userId, checklistId, ...checklistItemData } = payload;
    const db = await getDb();
    const item = await db.checklistItems
      .findOne({
        selector: { id, userId, checklistId },
      })
      .exec();

    if (!item) {
      return null;
    }

    const updatedItem = await item.patch(checklistItemData);

    return getChecklistItem(updatedItem.toJSON());
  }

  static async deleteChecklistItem(
    userId: string,
    checklistId: string,
    itemId: string
  ): Promise<void> {
    const db = await getDb();
    const item = await db.checklistItems
      .findOne({
        selector: { id: itemId, userId, checklistId },
      })
      .exec();

    if (!item) {
      return;
    }

    await item.remove();
  }
}
