export interface UserResponse {
  id: string;
  name: string;
}

export interface TaskResponse {
  id: string;
  title: string;
  description?: string;
}

export interface TaskWithChecklistsResponse extends TaskResponse {
  checklist: ChecklistResponse | null;
}

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
  status: "not_started" | "in_progress" | "blocked" | "final_check" | "done";
  statusMessage?: string;
}

export interface AddOrUpdateTaskRequest {
  title: string;
  userId: string;
}

export interface AddChecklistRequest {
  title?: string;
  taskId: string;
  userId: string;
  items?: Omit<AddChecklistItemRequest, "checklistId" | "userId">[];
}

export type UpdateChecklistRequest = Omit<AddChecklistRequest, "items">;

export interface AddChecklistItemRequest {
  title: string;
  checklistId: string;
  userId: string;
}

export interface UpdateChecklistItemRequest
  extends Partial<AddChecklistItemRequest> {
  id: string;
  status?: "not_started" | "in_progress" | "blocked" | "final_check" | "done";
  statusMessage?: string;
}
