// components/ToastProvider.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

const ToastContext = createContext<{
  toast: (msg: string, type?: ToastType) => void;
  toastSuccess: (msg: string) => void;
  toastError: (msg: string) => void;
  toastInfo: (msg: string) => void;
}>({
  toast: () => {},
  toastSuccess: () => {},
  toastError: () => {},
  toastInfo: () => {},
});

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const toastSuccess = (msg: string) => toast(msg, "success");
  const toastError = (msg: string) => toast(msg, "error");
  const toastInfo = (msg: string) => toast(msg, "info");

  return (
    <ToastContext.Provider value={{ toast, toastSuccess, toastError, toastInfo }}>
      {children}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded px-4 py-2 shadow text-white transition-opacity duration-300 ${
              toast.type === "error"
                ? "bg-red-400"
                : toast.type === "success"
                ? "bg-green-400"
                : toast.type === "info"
                ? "bg-yellow-400"
                : "bg-gray-700"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
