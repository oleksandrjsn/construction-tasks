import { useState, useEffect } from "react";
import { Typography, Button, Input, Dialog } from "../../../shared/ui";
import type { ChecklistItemModel } from "../model/types";

interface StatusChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    status: ChecklistItemModel["status"];
    message?: string;
  }) => void;
  currentStatus: ChecklistItemModel["status"] | null;
  currentMessage?: string;
}

const statusOptions: { value: ChecklistItemModel["status"]; label: string }[] =
  [
    { value: "not_started", label: "Not Started" },
    { value: "in_progress", label: "In Progress" },
    { value: "blocked", label: "Blocked" },
    { value: "final_check", label: "Final Check" },
    { value: "done", label: "Done" },
  ];

export const StatusIcon = ({
  status,
}: {
  status: ChecklistItemModel["status"];
}) => {
  const size = "w-8 h-8";

  switch (status) {
    case "not_started":
      return (
        <div
          className={`${size} border-2 border-gray-400 rounded bg-white transition-all duration-200 hover:border-gray-600 hover:shadow-sm`}
        />
      );
    case "in_progress":
      return (
        <div
          className={`${size} border-2 border-indigo-500 rounded bg-white relative transition-all duration-200 hover:border-indigo-600 hover:shadow-sm`}
        >
          <div className="absolute inset-1 bg-indigo-200 rounded-sm transition-all duration-200" />
        </div>
      );
    case "final_check":
      return (
        <div
          className={`${size} border-2 border-indigo-500 rounded bg-white relative transition-all duration-200 hover:border-indigo-600 hover:shadow-sm`}
        >
          <div className="absolute inset-1 bg-amber-200 rounded-sm transition-all duration-200" />
        </div>
      );
    case "done":
      return (
        <div
          className={`${size} border-2 border-emerald-500 rounded bg-emerald-500 flex items-center justify-center transition-all duration-200 hover:border-emerald-600 hover:bg-emerald-600 hover:shadow-sm`}
        >
          <svg
            className="w-5 h-5 text-white transition-transform duration-200 hover:scale-110"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    case "blocked":
      return (
        <div
          className={`${size} flex items-center justify-center transition-all duration-200 border-2 border-rose-500 rounded hover:border-rose-600 hover:shadow-sm`}
        >
          <svg
            className="w-5 h-5 text-rose-500 transition-all duration-200 hover:text-rose-600 hover:scale-110"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    default:
      return (
        <div
          className={`${size} border-2 border-gray-400 rounded bg-white transition-all duration-200 hover:border-gray-600 hover:shadow-sm`}
        />
      );
  }
};

export const StatusChangeDialog = ({
  isOpen,
  onClose,
  onConfirm,
  currentStatus,
  currentMessage = "",
}: StatusChangeDialogProps) => {
  const [selectedStatus, setSelectedStatus] = useState<
    ChecklistItemModel["status"]
  >(currentStatus || "not_started");
  const [message, setMessage] = useState(currentMessage);

  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(currentStatus || "not_started");
      setMessage(currentMessage);
    }
  }, [isOpen, currentStatus, currentMessage]);

  const handleConfirm = () => {
    const requiresMessage = selectedStatus === "blocked";
    if (requiresMessage && !message.trim()) {
      return;
    }

    onConfirm({
      status: selectedStatus,
      message: message || undefined,
    });
  };

  const getSelectedStatusText = () => {
    return (
      statusOptions.find((opt) => opt.value === selectedStatus)?.label || ""
    );
  };

  const isDisabled = selectedStatus === "blocked" && !message.trim();

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Change Status" size="md">
      <form className="space-y-4" onSubmit={handleConfirm}>
        <Typography variant="body1">
          Select new status for this item:
        </Typography>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
            <div className="transition-transform duration-200">
              <StatusIcon status={selectedStatus} />
            </div>
            <Typography variant="body2" className="font-medium">
              Current status:{" "}
              {statusOptions.find((opt) => opt.value === selectedStatus)?.label}
            </Typography>
          </div>

          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as ChecklistItemModel["status"])
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label={
            selectedStatus === "blocked"
              ? "Message (required)"
              : "Message (optional)"
          }
          placeholder="Enter message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          error={
            selectedStatus === "blocked" && !message.trim()
              ? "Message is required for blocked status"
              : undefined
          }
        />

        <div className="flex gap-2 justify-end">
          <Button variant="outline" type="reset" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" disabled={isDisabled}>
            Update to {getSelectedStatusText()}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
