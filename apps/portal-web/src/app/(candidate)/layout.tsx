"use client";

import React from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { PortalShell } from "@/components/portal-shell";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["candidate"]}>
      <PortalShell>{children}</PortalShell>
    </RoleGuard>
  );
}
