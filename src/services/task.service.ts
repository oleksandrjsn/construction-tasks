import { getDb } from "../db";
import type { TaskDocType } from "../db/schemas/task.schema";
import { ChecklistService } from "./checklist.service";
import { defaultChecklistItems } from "./defaultChecklistItems";
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskResponse,
  TaskWithChecklistsResponse,
} from "./types";
import { v4 as uuidv4 } from "uuid";

export class TaskService {
  static async getTasks(userId: string): Promise<TaskResponse[]> {
    const db = await getDb();
    const tasks = await db.tasks.find({ selector: { userId } }).exec();
    const tasksJson = tasks.map((task) => task.toJSON());

    return tasksJson.map((task) => ({
      id: task.id,
      title: task.title,
      position: task.position,
    }));
  }

  static async getTask(
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
      id: taskJson.id,
      title: taskJson.title!,
      checklist: checkList,
      position: taskJson.position,
    };
  }

  static async createTask(taskData: CreateTaskRequest): Promise<TaskResponse> {
    const db = await getDb();
    const newTask = await db.tasks.insert({
      ...taskData,
      id: uuidv4(),
    });
    const taskJson = newTask.toJSON();

    await ChecklistService.addChecklist({
      title: "",
      items: defaultChecklistItems.map((title) => ({
        title,
      })),
      taskId: taskJson.id,
      userId: taskData.userId,
    });

    return {
      id: taskJson.id,
      title: taskJson.title,
      position: taskJson.position,
    };
  }

  static async updateTask(
    payload: UpdateTaskRequest
  ): Promise<TaskDocType | null> {
    const { id, userId, ...taskData } = payload;

    const db = await getDb();
    const task = await db.tasks.findOne({ selector: { userId, id } }).exec();

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
