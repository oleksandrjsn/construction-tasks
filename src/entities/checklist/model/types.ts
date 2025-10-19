type ChecklistItemStatus =
  | "not_started"
  | "in_progress"
  | "blocked"
  | "final_check"
  | "done";

export interface ChecklistModel {
  id: string;
  taskId: string;
  title?: string;
}

export interface ChecklistItemModel {
  id: string;
  checklistId: string;
  title: string;
  status: ChecklistItemStatus;
  statusMessage?: string;
  position: number;
}

export interface CreateChecklistRequest {
  title: string;
  taskId: string;
  userId: string;
}

export interface UpdateChecklistRequest {
  taskId: string;
  userId: string;
  title: string;
}

export interface CreateChecklistItemRequest {
  title: string;
  checklistId: string;
  userId: string;
  position: number;
}

export interface UpdateChecklistItemRequest {
  id: string;
  userId: string;
  checklistId: string;
  title?: string;
  status?: ChecklistItemStatus;
  statusMessage?: string;
}
