import type { PortalRole } from "@/features/auth/mock-users";

export interface DashboardMetric {
  label: string;
  value: string;
  description: string;
  tone?: "primary" | "success" | "warning" | "danger" | "neutral";
}

export interface DashboardActivity {
  title: string;
  description: string;
  timestamp: string;
  status: "success" | "warning" | "info";
}

export interface DashboardQuickAction {
  label: string;
  description: string;
  href: string;
}

export interface DashboardWorkItem {
  label: string;
  value: number;
}

export interface RoleDashboard {
  role: PortalRole;
  title: string;
  subtitle: string;
  metrics: DashboardMetric[];
  activities: DashboardActivity[];
  quickActions: DashboardQuickAction[];
  workItems: DashboardWorkItem[];
  completion: number;
}
