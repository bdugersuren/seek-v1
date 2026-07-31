"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type ToastType = "success" | "danger" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: "fixed",
          bottom: "var(--seek-space-4)",
          right: "var(--seek-space-4)",
          zIndex: "var(--seek-z-toast)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--seek-space-2)",
          pointerEvents: "none",
        }}
        aria-live="assertive"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              padding: "var(--seek-space-3) var(--seek-space-4)",
              borderRadius: "var(--seek-radius-md)",
              backgroundColor: `var(--seek-color-${toast.type}-background, var(--seek-color-surface))`,
              color: `var(--seek-color-${toast.type}-foreground, var(--seek-color-foreground))`,
              border: `1px solid var(--seek-color-${toast.type}, var(--seek-color-border))`,
              boxShadow: "var(--seek-shadow-md)",
              pointerEvents: "auto",
              minWidth: "200px",
              maxWidth: "350px",
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
