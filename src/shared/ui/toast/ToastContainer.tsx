import React from "react";
import { useToastStore, type Toast } from "../../lib/toast/useToastStore";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const getToastClasses = () => {
    const baseClasses =
      "p-3 rounded-lg min-w-[300px] max-w-[500px] shadow-lg cursor-pointer relative";

    switch (toast.type) {
      case "success":
        return `${baseClasses} bg-green-100 border-l-4 border-green-500 text-green-800`;
      case "error":
        return `${baseClasses} bg-red-100 border-l-4 border-red-500 text-red-800`;
      case "warning":
        return `${baseClasses} bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800`;
      case "info":
        return `${baseClasses} bg-blue-100 border-l-4 border-blue-500 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 border-l-4 border-gray-500 text-gray-800`;
    }
  };

  return (
    <div className={getToastClasses()} onClick={onClose}>
      <div className="flex justify-between items-start">
        <div>
          <div className={`font-bold ${toast.message ? "mb-1" : ""}`}>
            {toast.title}
          </div>
          {toast.message && (
            <div className="text-sm opacity-90">{toast.message}</div>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="bg-transparent border-none text-lg cursor-pointer ml-2.5 opacity-70 hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      </div>
    </div>
  );
};
