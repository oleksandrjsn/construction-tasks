import { useState } from "react";
import {
  Button,
  IconButton,
  Input,
  Typography,
  withConfirmation,
} from "../../../shared/ui";
import { DeleteIcon, EditIcon } from "../../../shared/ui/icons/Icons";
import type { ChecklistItemModel } from "../model/types";
import { useChecklistItems } from "../model/useChecklistitems";
import { useChecklists } from "../model/useChecklists";
import { StatusChangeDialog, StatusIcon } from "./StatusChangeDialog";

interface ChecklistDetailProps {
  userId?: string;
  taskId?: string;
  checkListId?: string;
  title: string;
}

interface StatusDialogState {
  isOpen: boolean;
  itemId: string | null;
  currentStatus: ChecklistItemModel["status"] | null;
  currentMessage: string;
}

const ButtonWithConfirmation = withConfirmation(IconButton);

export const ChecklistDetail = ({
  checkListId,
  taskId,
  title,
  userId,
}: ChecklistDetailProps) => {
  const {
    checklistItems,
    updateChecklistItem,
    deleteChecklistItem,
    createChecklistItem,
  } = useChecklistItems(userId, taskId, checkListId);
  const { updateChecklist } = useChecklists(userId, taskId);
  const [statusDialog, setStatusDialog] = useState<StatusDialogState>({
    isOpen: false,
    itemId: null,
    currentStatus: null,
    currentMessage: "",
  });
  const [newItemTitle, setNewItemTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState(title);

  const clLength = checklistItems.length;

  const handleStatusClick = (item: ChecklistItemModel) => {
    setStatusDialog({
      isOpen: true,
      itemId: item.id,
      currentStatus: item.status,
      currentMessage: item.statusMessage || "",
    });
  };

  const handleConfirmStatusChange = async (data: {
    status: ChecklistItemModel["status"];
    message?: string;
  }) => {
    if (!statusDialog.itemId || !userId || !checkListId) return;

    await updateChecklistItem({
      id: statusDialog.itemId,
      userId,
      checklistId: checkListId,
      status: data.status,
      statusMessage: data.message,
    });

    setStatusDialog({
      isOpen: false,
      itemId: null,
      currentStatus: null,
      currentMessage: "",
    });
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!userId || !checkListId) return;
    await deleteChecklistItem(userId, checkListId, itemId);
  };

  const handleCloseStatusDialog = () => {
    setStatusDialog({
      isOpen: false,
      itemId: null,
      currentStatus: null,
      currentMessage: "",
    });
  };

  const handleCreateItem = async () => {
    if (!newItemTitle.trim() || !userId || !checkListId) return;

    setIsCreating(true);
    try {
      await createChecklistItem({
        title: newItemTitle.trim(),
        checklistId: checkListId,
        userId,
        position: clLength,
      });
      setNewItemTitle("");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleCreateItem();
  };

  const handleEditTitle = () => {
    setIsEditingTitle(true);
    setEditTitleValue(title);
  };

  const handleSaveTitle = async () => {
    if (!userId || !taskId || !editTitleValue.trim()) return;

    try {
      await updateChecklist({
        taskId,
        userId,
        title: editTitleValue.trim(),
      });
      setIsEditingTitle(false);
    } catch {
      // already handled in service
    }
  };

  const handleCancelEdit = () => {
    setIsEditingTitle(false);
    setEditTitleValue(title);
  };

  const handleTitleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSaveTitle();
  };

  return (
    <div>
      <div className="flex items-center gap-2 px-4 py-2">
        {isEditingTitle ? (
          <form
            onSubmit={handleTitleSubmit}
            className="flex items-center gap-2 flex-1"
          >
            <Input
              value={editTitleValue}
              onChange={(e) => setEditTitleValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  handleCancelEdit();
                }
              }}
              className="flex-1"
              placeholder="Checklist title (Enter to save, Esc to cancel)"
              autoFocus
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!editTitleValue.trim()}
            >
              Save
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancelEdit}
            >
              Cancel
            </Button>
          </form>
        ) : (
          <>
            <Typography variant="h6" className="font-semibold">
              {title || "Checklist Detail"}
            </Typography>
            <IconButton
              variant="ghost"
              size="sm"
              onClick={handleEditTitle}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <EditIcon size={16} />
            </IconButton>
            <Typography variant="body2" color="muted" className="capitalize">
              ({clLength} steps)
            </Typography>
          </>
        )}
      </div>

      <ul className="list-none px-4 py-2 m-0 border-y border-gray-200 space-y-2">
        {checklistItems
          .sort((t1, t2) => t1.position - t2.position)
          .map((item, index) => (
            <li
              key={item.id}
              className="group flex items-start gap-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 px-2 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => handleStatusClick(item)}
                className="mt-0.5 hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 rounded"
              >
                <StatusIcon status={item.status} />
              </button>

              <div className="flex-1 min-w-0">
                <Typography
                  variant="body1"
                  className={`font-medium transition-colors duration-200 ${
                    item.status === "done"
                      ? "line-through text-gray-500"
                      : "text-gray-900"
                  }`}
                >
                  {item.title}
                </Typography>
                {item.statusMessage && (
                  <Typography
                    variant="body2"
                    className="text-gray-600 mt-1 transition-colors duration-200"
                  >
                    {item.statusMessage}
                  </Typography>
                )}
              </div>

              <ButtonWithConfirmation
                size="sm"
                title="Delete Task"
                variant="danger"
                onConfirm={() => handleDeleteItem(item.id)}
                confirmationConfig={{
                  title: "Delete Checklist Item?",
                  message:
                    "Are you sure you want to delete this checklist item? This action cannot be undone.",
                  confirmText: "Delete",
                  cancelText: "Cancel",
                  confirmVariant: "danger",
                }}
              >
                <DeleteIcon size="14px" />
              </ButtonWithConfirmation>
            </li>
          ))}
      </ul>

      {/* Add new item section */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <div className="flex-1">
            <Input
              placeholder="Add new checklist item... (Enter to add, Esc to clear)"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              disabled={isCreating}
              fullWidth
            />
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleCreateItem}
            disabled={!newItemTitle.trim() || isCreating}
          >
            {isCreating ? "Adding..." : "Add"}
          </Button>
        </form>
      </div>

      <StatusChangeDialog
        isOpen={statusDialog.isOpen}
        onClose={handleCloseStatusDialog}
        onConfirm={handleConfirmStatusChange}
        currentStatus={statusDialog.currentStatus}
        currentMessage={statusDialog.currentMessage}
      />
    </div>
  );
};
