import { v4 as uuidv4 } from "uuid";
import { globalErrorHandler } from "../../../shared/lib/errors/GlobalErrorHandler";
import type {
  CreateTaskRequest,
  TaskComputedStatus,
  UpdateTaskRequest,
} from "../model/types";
import type { TaskRepository } from "./repository";
import type {
  ChecklistItemRepository,
  ChecklistRepository,
} from "../../checklist";
import {
  CHECK_LIST_STATUS,
  type ChecklistDocType,
  type ChecklistItemDocType,
} from "../../../shared/lib/database/schemas";
import { combineLatest, switchMap } from "rxjs";

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
      const tasks = await this.taskRepository.getAll(userId);
      const checklists = await this.checklistRepository.findByUserIdAndTaskId(
        userId,
        ""
      );
      const checklistItems =
        await this.checklistItemRepository.findByChecklistId("");

      return Promise.all(
        tasks.map(async (task) => {
          const status = await this.getComputedStatus(
            task.id,
            checklists ? [checklists] : [],
            checklistItems
          );
          return { ...task, status };
        })
      );
    } catch (error) {
      throw globalErrorHandler.handleError(error);
    }
  };

  getTaskDetails = async (userId: string, taskId: string) => {
    try {
      const task = await this.taskRepository.getOne(userId, taskId);
      if (!task) {
        throw new Error("Task not found");
      }

      const checklist = await this.checklistRepository.findByUserIdAndTaskId(
        userId,
        taskId
      );
      let checklistItems: ChecklistItemDocType[] = [];
      if (checklist) {
        checklistItems = await this.checklistItemRepository.findByChecklistId(
          checklist.id
        );
      }

      const status = await this.getComputedStatus(
        task.id,
        checklist ? [checklist] : [],
        checklistItems
      );

      return {
        ...task,
        status,
        checklist: { ...checklist, items: checklistItems },
      };
    } catch (error) {
      throw globalErrorHandler.handleError(error);
    }
  };

  createTask = async (taskData: CreateTaskRequest) => {
    try {
      const createdTask = await this.taskRepository.create({
        ...taskData,
        id: uuidv4(),
        updatedAt: Date.now(),
        createdAt: Date.now(),
      });

      const createdChecklist = await this.checklistRepository.create({
        id: uuidv4(),
        title: `Checklist for ${taskData.title}`,
        taskId: createdTask.id,
        userId: taskData.userId,
        updatedAt: Date.now(),
        createdAt: Date.now(),
      });

      const checklistItemsData = this.defaultChecklistItems.map(
        (title, index) => ({
          id: uuidv4(),
          userId: taskData.userId,
          checklistId: createdChecklist.id,
          title,
          status: CHECK_LIST_STATUS.NOT_STARTED,
          statusMessage: "",
          createdAt: Date.now(),
          updatedAt: Date.now(),
          position: index,
        })
      );

      await this.checklistItemRepository.bulkCreate(checklistItemsData);
    } catch (error) {
      throw globalErrorHandler.handleError(error);
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
      throw globalErrorHandler.handleError(error);
    }
  };

  deleteTask = async (userId: string, taskId: string): Promise<void> => {
    try {
      await this.taskRepository.delete(userId, taskId);
    } catch (error) {
      throw globalErrorHandler.handleError(error);
    }
  };

  subscribeToUserTasks = (userId: string) => {
    const tasks$ = this.taskRepository.subscribeToUserTasks(userId);
    const checklists$ =
      this.checklistRepository.subscribeToUserChecklists(userId);
    const checklistItems$ =
      this.checklistItemRepository.subscribeToAllUserChecklistItems(userId);

    return combineLatest([tasks$, checklists$, checklistItems$]).pipe(
      switchMap(async ([tasks, checklists, checklistItems]) => {
        return Promise.all(
          tasks.map(async (task) => {
            const status = await this.getComputedStatus(
              task.id,
              checklists,
              checklistItems
            );
            return { ...task, status };
          })
        );
      })
    );
  };

  private getComputedStatus = async (
    taskId: string,
    checklists: ChecklistDocType[],
    checklistItems: ChecklistItemDocType[]
  ): Promise<TaskComputedStatus> => {
    const checkList = checklists.find((cl) => cl.taskId === taskId);
    const checklistItemsForTask = checklistItems.filter(
      (item) => checkList && item.checklistId === checkList.id
    );
    if (
      checklistItemsForTask.length === 0 ||
      checklistItemsForTask.every((item) => item.status === "not_started")
    ) {
      return "not_started";
    }

    const allDone = checklistItemsForTask.every(
      (item) => item.status === "done"
    );

    if (allDone) {
      return "completed";
    }

    const anyBlocked = checklistItemsForTask.some(
      (item) => item.status === "blocked"
    );

    if (anyBlocked) {
      return "blocked";
    }

    return "in_progress";
  };
}
