import { map } from "rxjs";
import type { DatabaseType } from "../../../shared/lib/database";
import type { ChecklistItemDocType } from "../../../shared/lib/database/schemas";

export class ChecklistItemRepository {
  private db: DatabaseType;

  constructor(db: DatabaseType) {
    this.db = db;
  }

  async findByChecklistId(
    checklistId: string
  ): Promise<ChecklistItemDocType[]> {
    const items = await this.db.checklistItems
      .find({ selector: { checklistId } })
      .exec();

    return items.map((item) => item.toJSON());
  }

  async findById(
    userId: string,
    checklistId: string,
    itemId: string
  ): Promise<ChecklistItemDocType | null> {
    const item = await this.db.checklistItems
      .findOne({
        selector: { id: itemId, userId, checklistId },
      })
      .exec();

    return item ? item.toJSON() : null;
  }

  async create(itemData: ChecklistItemDocType): Promise<ChecklistItemDocType> {
    const newItem = await this.db.checklistItems.insert(itemData);
    return newItem.toJSON();
  }

  async bulkCreate(
    itemsData: ChecklistItemDocType[]
  ): Promise<ChecklistItemDocType[]> {
    const { error, success } = await this.db.checklistItems.bulkInsert(
      itemsData
    );

    if (error && error.length > 0) {
      console.error("Error inserting checklist items:", error);
    }

    return success.map((item) => item.toJSON());
  }

  async update(
    userId: string,
    checklistId: string,
    itemId: string,
    updateData: Partial<ChecklistItemDocType>
  ): Promise<ChecklistItemDocType | null> {
    const item = await this.db.checklistItems
      .findOne({
        selector: { id: itemId, userId, checklistId },
      })
      .exec();

    if (!item) {
      return null;
    }

    const updatedItem = await item.incrementalPatch(updateData);
    return updatedItem.toJSON();
  }

  async delete(
    userId: string,
    checklistId: string,
    itemId: string
  ): Promise<boolean> {
    const item = await this.db.checklistItems
      .findOne({
        selector: { id: itemId, userId, checklistId },
      })
      .exec();

    if (!item) {
      return false;
    }

    await item.remove();
    return true;
  }

  subscribeToUserChecklists(userId: string, checklistId: string) {
    return this.db.checklistItems
      .find({ selector: { userId, checklistId } })
      .$.pipe(
        map((checklistItems) => {
          return checklistItems.map((item) => item.toJSON());
        })
      );
  }
}
