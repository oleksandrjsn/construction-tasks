import { getDb } from "../db";
import type { TaskDocType } from "../db/schemas/task.schema";
import { ChecklistService } from "./checklist.service";
import { defaultChecklistItems } from "./defaultChecklistItems";
import type {
  AddOrUpdateTaskRequest,
  TaskResponse,
  TaskWithChecklistsResponse,
} from "./types";

export class TaskService {
  static async getTasksByUser(userId: string): Promise<TaskResponse[]> {
    const db = await getDb();
    const tasks = await db.tasks.find({ selector: { userId } }).exec();
    const tasksJson = tasks.map((task) => task.toJSON());

    return tasksJson.map((task) => ({
      id: task.id!,
      title: task.title,
    }));
  }

  static async getTaskByUserAndId(
    userId: string,
    taskId: string
  ): Promise<TaskWithChecklistsResponse | null> {
    const db = await getDb();
    const task = await db.tasks
      .findOne({ selector: { userId, id: taskId } })
      .exec();

    if (!task) {
      return null;
    }

    const taskJson = task.toJSON();

    const checkList = await ChecklistService.getChecklist(userId, taskId);

    return {
      id: taskJson.id!,
      title: taskJson.title!,
      checklist: checkList?.checklist || null,
    };
  }

  static async addTask(taskData: AddOrUpdateTaskRequest): Promise<TaskDocType> {
    const db = await getDb();
    const newTask = await db.tasks.insert(taskData);
    const taskJson = newTask.toJSON();

    await ChecklistService.addChecklist({
      title: "",
      items: defaultChecklistItems.map((title) => ({
        title,
      })),
      taskId: taskJson.id!,
      userId: taskData.userId,
    });

    return taskJson;
  }

  static async updateTask(
    taskData: AddOrUpdateTaskRequest
  ): Promise<TaskDocType | null> {
    const db = await getDb();
    const task = await db.tasks
      .findOne({ selector: { userId: taskData.userId, title: taskData.title } })
      .exec();

    if (!task) {
      return null;
    }

    const updatedTask = await task.patch(taskData);

    return updatedTask.toJSON();
  }

  static async deleteTask(userId: string, taskId: string): Promise<void> {
    const db = await getDb();
    const task = await db.tasks
      .findOne({ selector: { userId, id: taskId } })
      .exec();

    if (!task) {
      return;
    }

    await task.remove();

    ChecklistService.deleteChecklist(userId, taskId);
  }
}
