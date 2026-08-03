"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { Spinner } from "@seek/ui";
import type { PortalRole } from "@/features/auth/mock-users";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: PortalRole[];
  fallbackUrl?: string;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallbackUrl = "/login",
}: RoleGuardProps) {
  const router = useRouter();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace(fallbackUrl);
      } else if (!allowedRoles.includes(user.role)) {
        // Зөвшөөрөгдөөгүй бол тухайн хэрэглэгчийн default нүүр хуудас руу шилжүүлнэ
        router.replace(user.homePath || "/catalog");
      }
    }
  }, [user, loading, allowedRoles, fallbackUrl, router]);

  if (loading || !user || !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
