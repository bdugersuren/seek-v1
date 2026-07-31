"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface DialogOptions {
  title: string;
  description: string;
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
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: "var(--seek-z-modal)",
          }}
        >
          <div
            style={{
              backgroundColor: "var(--seek-color-surface)",
              color: "var(--seek-color-foreground)",
              padding: "var(--seek-space-6)",
              borderRadius: "var(--seek-radius-lg)",
              border: "1px solid var(--seek-color-border)",
              boxShadow: "var(--seek-shadow-lg)",
              maxWidth: "450px",
              width: "100%",
            }}
          >
            <h2
              id="seek-dialog-title"
              style={{
                fontSize: "var(--seek-font-size-xl)",
                fontWeight: "bold",
                marginBottom: "var(--seek-space-2)",
              }}
            >
              {activeDialog.title}
            </h2>
            <p
              id="seek-dialog-desc"
              style={{
                color: "var(--seek-color-muted)",
                marginBottom: "var(--seek-space-6)",
              }}
            >
              {activeDialog.description}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "var(--seek-space-3)",
              }}
            >
              <button
                onClick={() => {
                  activeDialog.onCancel?.();
                  closeDialog();
                }}
                style={{
                  padding: "var(--seek-space-2) var(--seek-space-4)",
                  borderRadius: "var(--seek-radius-md)",
                  border: "1px solid var(--seek-color-border)",
                  cursor: "pointer",
                  backgroundColor: "transparent",
                  color: "var(--seek-color-foreground)",
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
                  padding: "var(--seek-space-2) var(--seek-space-4)",
                  borderRadius: "var(--seek-radius-md)",
                  backgroundColor: "var(--seek-color-primary)",
                  color: "var(--seek-color-primary-foreground)",
                  border: "none",
                  cursor: "pointer",
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
