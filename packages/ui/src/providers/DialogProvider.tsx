"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface DialogOptions {
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface DialogContextType {
  showDialog: (options: DialogOptions) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [activeDialog, setActiveDialog] = useState<DialogOptions | null>(null);

  const showDialog = useCallback((options: DialogOptions) => {
    setActiveDialog(options);
  }, []);

  const closeDialog = useCallback(() => {
    setActiveDialog(null);
  }, []);

  return (
    <DialogContext.Provider value={{ showDialog, closeDialog }}>
      {children}
      {activeDialog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="seek-dialog-title"
          aria-describedby="seek-dialog-desc"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "var(--seek-color-surface, #ffffff)",
              color: "var(--seek-color-foreground, #0f172a)",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid var(--seek-color-border, #e2e8f0)",
              boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
              maxWidth: "500px",
              width: "calc(100% - 32px)",
            }}
          >
            <h2
              id="seek-dialog-title"
              style={{
                fontSize: "18px",
                fontWeight: "700",
                marginBottom: "12px",
                color: "#1e293b",
              }}
            >
              {activeDialog.title}
            </h2>
            <div
              id="seek-dialog-desc"
              style={{
                color: "#64748b",
                marginBottom: "24px",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              {activeDialog.description}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button
                onClick={() => {
                  activeDialog.onCancel?.();
                  closeDialog();
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  cursor: "pointer",
                  backgroundColor: "transparent",
                  color: "#475569",
                  fontWeight: "600",
                  fontSize: "13px",
                  transition: "all 0.2s",
                }}
              >
                {activeDialog.cancelLabel || "Үгүй"}
              </button>
              <button
                onClick={() => {
                  activeDialog.onConfirm?.();
                  closeDialog();
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "13px",
                  transition: "all 0.2s",
                }}
              >
                {activeDialog.confirmLabel || "Тийм"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}
