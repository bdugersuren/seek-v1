"use client";

import React from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { PortalShell } from "@/components/portal-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["organisation_admin", "super_admin"]}>
      <PortalShell>{children}</PortalShell>
    </RoleGuard>
  );
}
