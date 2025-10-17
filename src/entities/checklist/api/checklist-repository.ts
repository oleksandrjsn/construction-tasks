import type { DatabaseType } from "../../../shared/lib/database";
import type { ChecklistDocType } from "../../../shared/lib/database/schemas";

export class ChecklistRepository {
  private db: DatabaseType;

  constructor(db: DatabaseType) {
    this.db = db;
  }

  async findByUserIdAndTaskId(
    userId: string,
    taskId: string
  ): Promise<ChecklistDocType | null> {
    const checklist = await this.db.checklists
      .findOne({ selector: { taskId, userId } })
      .exec();

    return checklist ? checklist.toJSON() : null;
  }

  async findByUserIdAndChecklistId(
    userId: string,
    checklistId: string
  ): Promise<ChecklistDocType | null> {
    const checklist = await this.db.checklists
      .findOne({ selector: { userId, id: checklistId } })
      .exec();

    return checklist ? checklist.toJSON() : null;
  }

  async create(checklistData: ChecklistDocType): Promise<ChecklistDocType> {
    const newChecklist = await this.db.checklists.insert(checklistData);
    return newChecklist.toJSON();
  }

  async update(
    userId: string,
    taskId: string,
    updateData: Partial<ChecklistDocType>
  ): Promise<ChecklistDocType | null> {
    const checklist = await this.db.checklists
      .findOne({ selector: { taskId, userId } })
      .exec();

    if (!checklist) {
      return null;
    }

    const updatedChecklist = await checklist.patch(updateData);
    return updatedChecklist.toJSON();
  }

  async delete(userId: string, checklistId: string): Promise<boolean> {
    const checklist = await this.db.checklists
      .findOne({ selector: { userId, id: checklistId } })
      .exec();

    if (!checklist) {
      return false;
    }

    await checklist.remove();
    return true;
  }

  async checkExists(taskId: string, userId: string): Promise<boolean> {
    const checklist = await this.db.checklists
      .findOne({
        selector: {
          taskId,
          userId,
        },
      })
      .exec();

    return !!checklist;
  }
}
