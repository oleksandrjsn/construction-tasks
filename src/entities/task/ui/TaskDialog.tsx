import { Button, Dialog, Loader, Typography } from "../../../shared/ui";
import { Checklists } from "../../checklist/ui/Checklists";
import type { TaskComputedStatus } from "../model/types";

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  title: string;
  status: TaskComputedStatus;
  onDelete?: (taskId: string) => void;
  isDeleting?: boolean;
}

const getStatusConfig = (status: TaskComputedStatus) => {
  switch (status) {
    case "not_started":
      return {
        text: "Not started",
        color: "bg-neutral-500",
        textColor: "text-neutral-700",
      };
    case "in_progress":
      return {
        text: "In progress",
        color: "bg-indigo-600",
        textColor: "text-indigo-700",
      };
    case "completed":
      return {
        text: "Completed",
        color: "bg-emerald-600",
        textColor: "text-emerald-700",
      };
    case "blocked":
      return {
        text: "Blocked",
        color: "bg-rose-600",
        textColor: "text-rose-700",
      };
    default:
      return {
        text: "Unknown",
        color: "bg-gray-500",
        textColor: "text-gray-700",
      };
  }
};

export const TaskDialog = ({
  isOpen,
  onClose,
  taskId,
  title,
  status,
  onDelete,
  isDeleting,
}: TaskDialogProps) => {
  const statusConfig = getStatusConfig(status);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(taskId);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      slotProps={{
        contentClassName: "py-2",
      }}
      showCloseButton={false}
    >
      <div>
        {/* Header with title and status */}
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex-1">
            <Typography variant="h3" className="capitalize" component="h2">
              {title}
            </Typography>
          </div>
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full ${statusConfig.color} mr-2 flex-shrink-0`}
            />
            <span className={`text-sm font-medium ${statusConfig.textColor}`}>
              {statusConfig.text}
            </span>
          </div>
          <Button variant="danger" disabled={isDeleting} onClick={handleDelete}>
            {isDeleting ? <Loader size="sm" /> : "Delete"}
          </Button>
        </div>

        {/* Content area - placeholder for checklist */}
        <div className="border-y border-gray-200 py-6">
          <Checklists taskId={taskId} />
        </div>

        {/* Footer with close button */}
        <div className="flex justify-end pt-3 px-4 pb-1">
          <Button onClick={onClose} disabled={isDeleting}>
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
