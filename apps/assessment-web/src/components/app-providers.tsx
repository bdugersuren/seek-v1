"use client";

import React from "react";
import { UiProvider } from "@seek/ui";
import { StoreProvider } from "@/store/Provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <UiProvider>{children}</UiProvider>
    </StoreProvider>
  );
}
