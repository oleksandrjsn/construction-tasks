type ChecklistItemStatus =
  | "not_started"
  | "in_progress"
  | "blocked"
  | "final_check"
  | "done";

export interface ChecklistResponse {
  id: string;
  taskId: string;
  title?: string;
  items: ChecklistItemResponse[];
}

export interface ChecklistItemResponse {
  id: string;
  checklistId: string;
  title: string;
  status: ChecklistItemStatus;
  statusMessage?: string;
}

export interface AddChecklistRequest {
  title: string;
  taskId: string;
  userId: string;
  items?: Omit<AddChecklistItemRequest, "checklistId" | "userId">[];
}

export interface UpdateChecklistRequest {
  taskId: string;
  userId: string;
  title: string;
}

export interface AddChecklistItemRequest {
  title: string;
  checklistId: string;
  userId: string;
}

export interface UpdateChecklistItemRequest {
  id: string;
  userId: string;
  checklistId: string;
  title?: string;
  status?: ChecklistItemStatus;
  statusMessage?: string;
}
