import { v4 as uuidv4 } from "uuid";
import { globalErrorHandler } from "../../../shared/lib/errors/GlobalErrorHandler";
import type {
  CreateChecklistItemRequest,
  CreateChecklistRequest,
  UpdateChecklistItemRequest,
  UpdateChecklistRequest,
} from "../model/types";
import type { ChecklistItemRepository } from "./checklist-item-repository";
import type { ChecklistRepository } from "./checklist-repository";
import { CHECK_LIST_STATUS } from "../../../shared/lib/database/schemas";

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

  getChecklist = async (userId: string, taskId: string) => {
    try {
      const checklist = await this.checklistRepository.findByUserIdAndTaskId(
        userId,
        taskId
      );

      if (!checklist) {
        throw new Error("Checklist not found.");
      }

      const items = await this.checklistItemRepository.findByChecklistId(
        checklist.id
      );

      return {
        id: checklist.id,
        title: checklist.title,
        taskId: checklist.taskId,
        items: items,
      };
    } catch (error) {
      globalErrorHandler.handleError(error);
    }
  };

  createChecklist = async (checklistData: CreateChecklistRequest) => {
    try {
      return await this.checklistRepository.create({
        ...checklistData,
        id: uuidv4(),
        updatedAt: Date.now(),
        createdAt: Date.now(),
      });
    } catch (error) {
      globalErrorHandler.handleError(error);
    }
  };

  updateChecklist = async (payload: UpdateChecklistRequest) => {
    try {
      const { userId, taskId, ...updateData } = payload;

      return await this.checklistRepository.update(userId, taskId, updateData);
    } catch (error) {
      globalErrorHandler.handleError(error);
    }
  };

  deleteChecklist = async (
    userId: string,
    checklistId: string
  ): Promise<void> => {
    try {
      await this.checklistRepository.delete(userId, checklistId);
    } catch (error) {
      globalErrorHandler.handleError(error);
    }
  };

  createChecklistItem = async (payload: CreateChecklistItemRequest) => {
    try {
      return await this.checklistItemRepository.create({
        ...payload,
        id: uuidv4(),
        status: CHECK_LIST_STATUS.NOT_STARTED,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    } catch (error) {
      globalErrorHandler.handleError(error);
    }
  };

  updateChecklistItem = async (payload: UpdateChecklistItemRequest) => {
    try {
      const { id, userId, checklistId, ...updateData } = payload;

      return await this.checklistItemRepository.update(
        userId,
        checklistId,
        id,
        updateData
      );
    } catch (error) {
      globalErrorHandler.handleError(error);
    }
  };

  deleteChecklistItem = async (
    userId: string,
    checklistId: string,
    itemId: string
  ): Promise<void> => {
    try {
      await this.checklistItemRepository.delete(userId, checklistId, itemId);
    } catch (error) {
      globalErrorHandler.handleError(error);
    }
  };

  subscribeToUserChecklists = (userId: string, taskId: string) => {
    return this.checklistRepository.subscribeToUserChecklistsByTask(
      userId,
      taskId
    );
  };

  subscribeToChecklistItems = (userId: string, checklistId: string) => {
    return this.checklistItemRepository.subscribeToUserChecklistItems(
      userId,
      checklistId
    );
  };
}
