import type { ChecklistResponse } from "../../checklist";

export interface TaskResponse {
  id: string;
  title: string;
  position: {
    x: number;
    y: number;
  };
}

export interface TaskWithChecklistsResponse extends TaskResponse {
  checklist: ChecklistResponse | null;
}
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
