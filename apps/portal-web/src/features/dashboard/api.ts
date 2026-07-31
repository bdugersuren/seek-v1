import type { PortalRole } from "@/features/auth/mock-users";
import { roleDashboards } from "./mock-data";

export async function getDashboardForRole(role: PortalRole) {
  return roleDashboards[role];
}
