import { v4 as uuidv4 } from "uuid";
import type { TaskRepository } from "./repository";
import type { ChecklistService } from "../../checklist";
import type {
  CreateTaskRequest,
  TaskResponse,
  TaskWithChecklistsResponse,
  UpdateTaskRequest,
} from "../model";
import {
  NotFoundError,
  ValidationError,
} from "../../../shared/lib/errors/AppError";
import { globalErrorHandler } from "../../../shared/lib/errors/GlobalErrorHandler";

export class TaskService {
  private taskRepository: TaskRepository;
  private checklistService: ChecklistService;
  private defaultChecklistItems = [
    "Plan and prepare",
    "Do the work",
    "Review and finalize",
  ];

  constructor(
    taskRepository: TaskRepository,
    checklistService: ChecklistService
  ) {
    this.taskRepository = taskRepository;
    this.checklistService = checklistService;
  }

  async getTasks(userId: string): Promise<TaskResponse[]> {
    return globalErrorHandler.wrapAsync(async () => {
      const tasks = await this.taskRepository.findByUserId(userId);

      return tasks.map((task) => ({
        id: task.id,
        title: task.title,
        position: task.position,
      }));
    });
  }

  async getTask(
    userId: string,
    taskId: string
  ): Promise<TaskWithChecklistsResponse | null> {
    return globalErrorHandler.wrapAsync(async () => {
      const task = await this.taskRepository.findByUserIdAndTaskId(
        userId,
        taskId
      );

      if (!task) {
        throw new NotFoundError("Task", taskId);
      }

      const checkList = await this.checklistService.getChecklist(
        userId,
        taskId
      );

      return {
        id: task.id,
        title: task.title,
        checklist: checkList,
        position: task.position,
      };
    });
  }

  async createTask(taskData: CreateTaskRequest): Promise<TaskResponse> {
    return globalErrorHandler.wrapAsync(async () => {
      if (!taskData.title?.trim()) {
        throw new ValidationError("Task title is required");
      }

      const newTask = await this.taskRepository.create({
        ...taskData,
        id: uuidv4(),
      });

      await this.checklistService.addChecklist({
        title: "",
        items: this.defaultChecklistItems.map((title) => ({
          title,
        })),
        taskId: newTask.id,
        userId: taskData.userId,
      });

      return {
        id: newTask.id,
        title: newTask.title,
        position: newTask.position,
      };
    });
  }

  async updateTask(payload: UpdateTaskRequest): Promise<TaskResponse | null> {
    return globalErrorHandler.wrapAsync(async () => {
      const { id, userId, ...taskData } = payload;

      if (taskData.title !== undefined && !taskData.title?.trim()) {
        throw new Error("Task title cannot be empty");
      }

      const updatedTask = await this.taskRepository.update(
        userId,
        id,
        taskData
      );

      if (!updatedTask) {
        return null;
      }

      return {
        id: updatedTask.id,
        title: updatedTask.title,
        position: updatedTask.position,
      };
    });
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    return globalErrorHandler.wrapAsync(async () => {
      const deleted = await this.taskRepository.delete(userId, taskId);

      if (deleted) {
        await this.checklistService.deleteChecklist(userId, taskId);
      }
    });
  }

  // Reactive subscription
  subscribeToUserTasks(userId: string) {
    return this.taskRepository.subscribeToUserTasks(userId);
  }
}
