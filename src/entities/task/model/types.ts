export interface CreateTaskRequest {
  title: string;
  userId: string;
  position: {
    x: number;
    y: number;
  };
}

export interface UpdateTaskRequest extends Omit<CreateTaskRequest, "position"> {
  id: string;
}

export type TaskComputedStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "blocked";

export interface TaskModel {
  id: string;
  title: string;
  userId: string;
  position: {
    x: number;
    y: number;
  };
  updatedAt: number;
  status: TaskComputedStatus;
}
