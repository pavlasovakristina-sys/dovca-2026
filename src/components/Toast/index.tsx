import { useEffect } from "react";

export interface ToastMessage {
  id: number;
  message: string;
  type: "success" | "error";
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}

export function Toast({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed top-16 left-0 right-0 z-[200] flex flex-col items-center gap-2 pointer-events-none px-4">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className="pointer-events-auto px-4 py-2 rounded-full text-sm font-medium shadow-lg"
      style={{
        backgroundColor: toast.type === "success" ? "#166534" : "#991B1B",
        color: "white",
        boxShadow: "var(--shadow-elevated)",
      }}
      role="status"
      aria-live="polite"
    >
      {toast.message}
    </div>
  );
}
