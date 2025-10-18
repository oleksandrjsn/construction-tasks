import { v4 as uuidv4 } from "uuid";
import { globalErrorHandler } from "../../../shared/lib/errors/GlobalErrorHandler";
import type { CreateTaskRequest, UpdateTaskRequest } from "../model/types";
import type { TaskRepository } from "./repository";
import type {
  ChecklistItemRepository,
  ChecklistRepository,
} from "../../checklist";
import { CHECK_LIST_STATUS } from "../../../shared/lib/database/schemas";

export class TaskService {
  private taskRepository: TaskRepository;
  private checklistRepository: ChecklistRepository;
  private checklistItemRepository: ChecklistItemRepository;

  private defaultChecklistItems = [
    "Plan and prepare",
    "Do the work",
    "Review and finalize",
  ];

  constructor(
    taskRepository: TaskRepository,
    checklistRepository: ChecklistRepository,
    checklistItemRepository: ChecklistItemRepository
  ) {
    this.taskRepository = taskRepository;
    this.checklistRepository = checklistRepository;
    this.checklistItemRepository = checklistItemRepository;
  }

  getUserTasks = async (userId: string) => {
    try {
      return await this.taskRepository.getAll(userId);
    } catch (error) {
      return globalErrorHandler.handleError(error);
    }
  };

  getTaskDetails = async (userId: string, taskId: string) => {
    try {
      return await this.taskRepository.getOne(userId, taskId);
    } catch (error) {
      return globalErrorHandler.handleError(error);
    }
  };

  createTask = async (taskData: CreateTaskRequest) => {
    try {
      const createdTask = await this.taskRepository.create({
        ...taskData,
        id: uuidv4(),
        updatedAt: Date.now(),
      });

      const createdChecklist = await this.checklistRepository.create({
        id: uuidv4(),
        title: `Checklist for ${taskData.title}`,
        taskId: createdTask.id,
        userId: taskData.userId,
        updatedAt: Date.now(),
      });

      const checklistItemsData = this.defaultChecklistItems.map(
        (title, index) => ({
          id: uuidv4(),
          userId: taskData.userId,
          checklistId: createdChecklist.id,
          title,
          status: CHECK_LIST_STATUS.NOT_STARTED,
          statusMessage: "",
          updatedAt: Date.now(),
          position: index,
        })
      );

      await this.checklistItemRepository.bulkCreate(checklistItemsData);
    } catch (error) {
      return globalErrorHandler.handleError(error);
    }
  };

  updateTask = async (payload: UpdateTaskRequest) => {
    try {
      const { id, userId, ...taskData } = payload;

      if (taskData.title !== undefined && !taskData.title?.trim()) {
        throw new Error("Task title cannot be empty");
      }

      return await this.taskRepository.update(userId, id, taskData);
    } catch (error) {
      globalErrorHandler.handleError(error);
    }
  };

  deleteTask = async (userId: string, taskId: string): Promise<void> => {
    try {
      await this.taskRepository.delete(userId, taskId);
    } catch (error) {
      globalErrorHandler.handleError(error);
    }
  };

  subscribeToUserTasks = (userId: string) => {
    return this.taskRepository.subscribeToUserTasks(userId);
  };
}
