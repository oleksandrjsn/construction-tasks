import { map } from "rxjs";
import type { DatabaseType } from "../../../shared/lib/database";
import type { TaskDocType } from "../../../shared/lib/database/schemas";

export class TaskRepository {
  private db: DatabaseType;

  constructor(db: DatabaseType) {
    this.db = db;
  }

  getAll = async (userId: string): Promise<TaskDocType[]> => {
    const tasks = await this.db.tasks.find({ selector: { userId } }).exec();

    return tasks.map((task) => {
      return task.toJSON();
    });
  };

  getOne = async (
    userId: string,
    taskId: string
  ): Promise<TaskDocType | null> => {
    const task = await this.db.tasks
      .findOne({ selector: { userId, id: taskId } })
      .exec();

    return task ? task.toJSON() : null;
  };

  create = async (taskData: TaskDocType): Promise<TaskDocType> => {
    const newTask = await this.db.tasks.insert(taskData);
    return newTask.toJSON();
  };

  update = async (
    userId: string,
    taskId: string,
    updateData: Partial<TaskDocType>
  ): Promise<TaskDocType> => {
    const task = await this.db.tasks
      .findOne({ selector: { userId, id: taskId } })
      .exec();

    if (!task) {
      throw new Error("Task not found");
    }

    const updatedTask = await task.incrementalPatch(updateData);
    return updatedTask.toJSON();
  };

  delete = async (userId: string, taskId: string): Promise<boolean> => {
    const task = await this.db.tasks
      .findOne({ selector: { userId, id: taskId } })
      .exec();

    if (!task) {
      throw new Error("Task not found");
    }

    await task.remove();
    return true;
  };

  subscribeToUserTasks = (userId: string) => {
    return this.db.tasks.find({ selector: { userId } }).$.pipe(
      map((task) => {
        return task.map((checklist) => checklist.toJSON());
      })
    );
  };
}
