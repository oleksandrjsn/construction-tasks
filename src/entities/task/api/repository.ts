import { combineLatest, switchMap } from "rxjs";
import type { DatabaseType } from "../../../shared/lib/database";
import type {
  ChecklistDocType,
  ChecklistItemDocType,
  TaskDocType,
} from "../../../shared/lib/database/schemas";
import type { TaskComputedStatus } from "../model";

export class TaskRepository {
  private db: DatabaseType;

  constructor(db: DatabaseType) {
    this.db = db;
  }

  getAll = async (userId: string) => {
    const tasks = await this.db.tasks.find({ selector: { userId } }).exec();
    const checklists = await this.db.checklists
      .find({ selector: { userId } })
      .exec();
    const checklistItems = await this.db.checklistItems
      .find({
        selector: { userId },
      })
      .exec();
    return tasks.map(async (task) => {
      const taskJson = task.toJSON();
      return {
        ...taskJson,
        status: await this.getComputedStatus(
          task.id,
          checklists,
          checklistItems
        ),
      };
    });
  };

  getOne = async (userId: string, taskId: string) => {
    const task = await this.db.tasks
      .findOne({ selector: { userId, id: taskId } })
      .exec();

    return task ? task.toJSON() : null;
  };

  create = async (taskData: TaskDocType) => {
    const newTask = await this.db.tasks.insert(taskData);
    return newTask.toJSON();
  };

  update = async (
    userId: string,
    taskId: string,
    updateData: Partial<TaskDocType>
  ) => {
    const task = await this.db.tasks
      .findOne({ selector: { userId, id: taskId } })
      .exec();

    if (!task) {
      throw new Error("Task not found");
    }

    const updatedTask = await task.incrementalPatch(updateData);
    return updatedTask.toJSON();
  };

  delete = async (userId: string, taskId: string) => {
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
    const tasks$ = this.db.tasks.find({ selector: { userId } }).$;
    const checklists$ = this.db.checklists.find({
      selector: { userId },
    }).$;
    const checklistItems$ = this.db.checklistItems.find({
      selector: { userId },
    }).$;

    return combineLatest([tasks$, checklists$, checklistItems$]).pipe(
      switchMap(async ([tasks, checklists, checklistItems]) => {
        return Promise.all(
          tasks.map(async (task) => {
            const taskJson = task.toJSON();
            const status = await this.getComputedStatus(
              task.id,
              checklists,
              checklistItems
            );
            return { ...taskJson, status };
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
