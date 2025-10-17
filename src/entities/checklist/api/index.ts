import { v4 as uuidv4 } from "uuid";
import type { ChecklistItemDocType } from "../../../shared/lib/database/schemas/checklistItem.schema";
import type {
  AddChecklistItemRequest,
  AddChecklistRequest,
  ChecklistItemResponse,
  ChecklistResponse,
  UpdateChecklistItemRequest,
  UpdateChecklistRequest,
} from "../model";
import type { ChecklistItemRepository } from "./checklist-item-repository";
import type { ChecklistRepository } from "./checklist-repository";
import { globalErrorHandler } from "../../../shared/lib/errors/GlobalErrorHandler";

export class ChecklistService {
  private checklistRepository: ChecklistRepository;
  private checklistItemRepository: ChecklistItemRepository;

  constructor(
    checklistRepository: ChecklistRepository,
    checklistItemRepository: ChecklistItemRepository
  ) {
    this.checklistRepository = checklistRepository;
    this.checklistItemRepository = checklistItemRepository;
  }
  async getChecklist(
    userId: string,
    taskId: string
  ): Promise<ChecklistResponse | null> {
    return globalErrorHandler.wrapAsync(async () => {
      const checklist = await this.checklistRepository.findByUserIdAndTaskId(
        userId,
        taskId
      );

      if (!checklist) {
        return null;
      }

      const items = await this.checklistItemRepository.findByChecklistId(
        checklist.id
      );

      return {
        id: checklist.id,
        title: checklist.title,
        taskId: checklist.taskId,
        items: items.map(this.getChecklistItem),
      };
    });
  }

  async addChecklist(payload: AddChecklistRequest): Promise<ChecklistResponse> {
    return globalErrorHandler.wrapAsync(async () => {
      const { items, ...checklistData } = payload;

      const existingChecklist = await this.checklistRepository.checkExists(
        checklistData.taskId,
        checklistData.userId
      );

      if (existingChecklist) {
        throw new Error("Checklist for this task already exists.");
      }

      const newChecklist = await this.checklistRepository.create({
        ...checklistData,
        id: uuidv4(),
      });

      let insertedItems: ChecklistItemResponse[] = [];

      if (items && items.length > 0) {
        const itemsToInsert = items.map((item) => ({
          ...item,
          checklistId: newChecklist.id,
          userId: checklistData.userId,
          status: "not_started" as const,
          id: uuidv4(),
        }));

        const insertedItemsData = await this.checklistItemRepository.bulkCreate(
          itemsToInsert
        );
        insertedItems = insertedItemsData.map(this.getChecklistItem);
      }

      return {
        id: newChecklist.id,
        title: newChecklist.title,
        taskId: newChecklist.taskId,
        items: insertedItems,
      };
    });
  }

  async updateChecklist(
    payload: UpdateChecklistRequest
  ): Promise<ChecklistResponse | null> {
    return globalErrorHandler.wrapAsync(async () => {
      const { taskId, userId, ...checklistData } = payload;

      const updatedChecklist = await this.checklistRepository.update(
        userId,
        taskId,
        checklistData
      );

      if (!updatedChecklist) {
        return null;
      }

      const items = await this.checklistItemRepository.findByChecklistId(
        updatedChecklist.id
      );

      return {
        id: updatedChecklist.id,
        title: updatedChecklist.title,
        taskId: updatedChecklist.taskId,
        items: items.map(this.getChecklistItem),
      };
    });
  }

  async deleteChecklist(userId: string, checklistId: string): Promise<void> {
    return globalErrorHandler.wrapAsync(async () => {
      const deleted = await this.checklistRepository.delete(
        userId,
        checklistId
      );

      if (deleted) {
        await this.checklistItemRepository.deleteByChecklistId(checklistId);
      }
    });
  }

  async addChecklistItem(
    payload: AddChecklistItemRequest
  ): Promise<ChecklistItemResponse> {
    return globalErrorHandler.wrapAsync(async () => {
      const checklist =
        await this.checklistRepository.findByUserIdAndChecklistId(
          payload.userId,
          payload.checklistId
        );

      if (!checklist) {
        throw new Error("Checklist not found");
      }

      const newItem = await this.checklistItemRepository.create({
        id: uuidv4(),
        title: payload.title,
        checklistId: payload.checklistId,
        userId: payload.userId,
        status: "not_started",
      });

      return this.getChecklistItem(newItem);
    });
  }

  async updateChecklistItem(
    payload: UpdateChecklistItemRequest
  ): Promise<ChecklistItemResponse | null> {
    return globalErrorHandler.wrapAsync(async () => {
      const { id, userId, checklistId, ...checklistItemData } = payload;

      const updatedItem = await this.checklistItemRepository.update(
        userId,
        checklistId,
        id,
        checklistItemData
      );

      if (!updatedItem) {
        return null;
      }

      return this.getChecklistItem(updatedItem);
    });
  }

  async deleteChecklistItem(
    userId: string,
    checklistId: string,
    itemId: string
  ): Promise<void> {
    return globalErrorHandler.wrapAsync(async () => {
      await this.checklistItemRepository.delete(userId, checklistId, itemId);
    });
  }

  private getChecklistItem(item: ChecklistItemDocType): ChecklistItemResponse {
    return {
      id: item.id,
      checklistId: item.checklistId,
      title: item.title,
      status: item.status,
      statusMessage: item.statusMessage,
    };
  }
}
