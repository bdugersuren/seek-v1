"use client";

import React from "react";
import { UiProvider } from "@seek/ui";
import { StoreProvider } from "@/store/Provider";
import { AuthBootstrap } from "@/components/auth-bootstrap";
import { I18nProvider } from "@/i18n/provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <I18nProvider>
        <UiProvider>
          <AuthBootstrap>{children}</AuthBootstrap>
        </UiProvider>
      </I18nProvider>
    </StoreProvider>
  );
}
