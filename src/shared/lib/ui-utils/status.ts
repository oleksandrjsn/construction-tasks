// UI utilities for status-related components
// This module provides UI-specific helpers for status rendering

type ChipVariant = "default" | "primary" | "success" | "warning" | "error";

// Helper function to get chip variant based on task/checklist status
export const getStatusChipVariant = (status: string): ChipVariant => {
  switch (status) {
    case "completed":
    case "done":
      return "success";
    case "in_progress":
      return "primary";
    case "blocked":
      return "error";
    case "not_started":
      return "default";
    case "final_check":
      return "warning";
    default:
      return "default";
  }
};

// Helper function to format status text for display
export const formatStatusText = (status: string): string => {
  return status.replace("_", " ").toUpperCase();
};
