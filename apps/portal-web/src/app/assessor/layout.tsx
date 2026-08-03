"use client";

import React from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { PortalShell } from "@/components/portal-shell";

export default function AssessorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["assessor"]}>
      <PortalShell>{children}</PortalShell>
    </RoleGuard>
  );
}
