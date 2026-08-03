"use client";

import React from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { PortalShell } from "@/components/portal-shell";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["super_admin"]}>
      <PortalShell>{children}</PortalShell>
    </RoleGuard>
  );
}
