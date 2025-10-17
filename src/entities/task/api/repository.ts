import type { DatabaseType } from "../../../shared/lib/database";
import type { TaskDocType } from "../../../shared/lib/database/schemas";

export class TaskRepository {
  private db: DatabaseType;

  constructor(db: DatabaseType) {
    this.db = db;
  }

  async findByUserId(userId: string): Promise<TaskDocType[]> {
    const tasks = await this.db.tasks.find({ selector: { userId } }).exec();
    return tasks.map((task) => task.toJSON());
  }

  async findByUserIdAndTaskId(
    userId: string,
    taskId: string
  ): Promise<TaskDocType | null> {
    const task = await this.db.tasks
      .findOne({ selector: { userId, id: taskId } })
      .exec();

    return task ? task.toJSON() : null;
  }

  async create(taskData: TaskDocType): Promise<TaskDocType> {
    const newTask = await this.db.tasks.insert(taskData);
    return newTask.toJSON();
  }

  async update(
    userId: string,
    taskId: string,
    updateData: Partial<TaskDocType>
  ): Promise<TaskDocType | null> {
    const task = await this.db.tasks
      .findOne({ selector: { userId, id: taskId } })
      .exec();

    if (!task) {
      return null;
    }

    const updatedTask = await task.incrementalPatch(updateData);
    return updatedTask.toJSON();
  }

  async delete(userId: string, taskId: string): Promise<boolean> {
    const task = await this.db.tasks
      .findOne({ selector: { userId, id: taskId } })
      .exec();

    if (!task) {
      return false;
    }

    await task.remove();
    return true;
  }

  // Reactive subscription
  subscribeToUserTasks(userId: string) {
    return this.db.tasks.find({ selector: { userId } }).$;
  }
}
