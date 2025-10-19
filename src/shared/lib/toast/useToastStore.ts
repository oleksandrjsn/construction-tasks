import { create } from "zustand";

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  showError: (error: Error | Error | string) => void;
  showSuccess: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  clearAllToasts: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (toast) => {
    const id = generateId();
    const newToast: Toast = { ...toast, id };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto remove after duration
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => get().removeToast(id), duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  showError: (error) => {
    let title = "Error";
    let message = "";

    if (error instanceof Error) {
      title = error.name;
      message = error.message;
    } else {
      message = error;
    }

    get().addToast({
      type: "error",
      title,
      message,
      duration: 7000,
    });
  },

  showSuccess: (message, title = "Success") => {
    get().addToast({
      type: "success",
      title,
      message,
      duration: 3000,
    });
  },

  showWarning: (message, title = "Warning") => {
    get().addToast({
      type: "warning",
      title,
      message,
      duration: 5000,
    });
  },

  showInfo: (message, title = "Information") => {
    get().addToast({
      type: "info",
      title,
      message,
      duration: 4000,
    });
  },

  clearAllToasts: () => {
    set({ toasts: [] });
  },
}));
