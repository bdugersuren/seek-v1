"use client";

import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { DialogProvider } from "./DialogProvider";
import { ToastProvider } from "./ToastProvider";
import { QueryProvider } from "./QueryProvider";

export function UiProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DialogProvider>
        <ToastProvider>
          <QueryProvider>{children}</QueryProvider>
        </ToastProvider>
      </DialogProvider>
    </ThemeProvider>
  );
}

export * from "./ThemeProvider";
export * from "./DialogProvider";
export * from "./ToastProvider";
export * from "./QueryProvider";
