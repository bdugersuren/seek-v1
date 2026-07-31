"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Badge,
  Card,
  Heading,
  PageContainer,
  PageTitle,
  ProgressBar,
  Stack,
  Text,
} from "@seek/ui";
import type { RootState } from "@/store";
import type { PortalRole, PortalUser } from "@/features/auth/mock-users";
import { roleDashboards } from "@/features/dashboard/mock-data";

const metricToneClass = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  neutral: "text-foreground",
};

const statusVariant = {
  success: "success",
  warning: "warning",
  info: "secondary",
} as const;

export default function DashboardPage() {
  const user = useSelector(
    (state: RootState) => state.auth.user,
  ) as PortalUser | null;

  const role = (user?.role || "assessor") as PortalRole;
  const dashboard = useMemo(() => roleDashboards[role], [role]);

  return (
    <PageContainer>
      <div className="flex flex-col gap-seek-4 lg:flex-row lg:items-start lg:justify-between">
        <PageTitle title={dashboard.title} subtitle={dashboard.subtitle} />
        <div className="flex flex-wrap items-center gap-seek-2">
          <Badge>{user?.roleLabel || "Assessor"}</Badge>
          <Badge variant="secondary">{user?.organisation || "seek.mn"}</Badge>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-seek-4 md:grid-cols-2 xl:grid-cols-3">
        {dashboard.metrics.map((metric) => (
          <Card key={metric.label}>
            <Stack gap={2}>
              <Text variant="muted" className="text-sm font-medium">
                {metric.label}
              </Text>
              <Text
                className={`text-3xl font-bold ${
                  metricToneClass[metric.tone || "neutral"]
                }`}
              >
                {metric.value}
              </Text>
              <Text variant="muted">{metric.description}</Text>
            </Stack>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-seek-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Card>
          <Stack gap={5}>
            <div className="flex flex-col gap-seek-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Heading level={2} className="text-xl">
                  Workflow readiness
                </Heading>
                <Text variant="muted">
                  Энэ role-ийн одоогийн ажлын явцын mock тойм.
                </Text>
              </div>
              <Text className="text-2xl font-bold text-primary">
                {dashboard.completion}%
              </Text>
            </div>
            <ProgressBar value={dashboard.completion} />
            <div className="grid grid-cols-1 gap-seek-3 md:grid-cols-3">
              {dashboard.workItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-seek-md border border-border bg-muted-background p-seek-4"
                >
                  <Text className="text-2xl font-bold">{item.value}</Text>
                  <Text variant="muted" className="text-sm">
                    {item.label}
                  </Text>
                </div>
              ))}
            </div>
          </Stack>
        </Card>

        <Card>
          <Stack gap={4}>
            <Heading level={2} className="text-xl">
              Quick actions
            </Heading>
            {dashboard.quickActions.map((action) => (
              <div
                key={action.href}
                className="rounded-seek-md border border-border p-seek-3"
              >
                <Stack gap={2}>
                  <Text className="font-medium">{action.label}</Text>
                  <Text variant="muted" className="text-sm">
                    {action.description}
                  </Text>
                  <Link
                    href={action.href}
                    className="inline-flex items-center justify-center rounded-seek-md border border-border bg-surface px-seek-3 py-seek-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    Нээх
                  </Link>
                </Stack>
              </div>
            ))}
          </Stack>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-seek-4 lg:grid-cols-2">
        {dashboard.activities.map((activity) => (
          <Card key={`${activity.title}-${activity.timestamp}`}>
            <Stack gap={3}>
              <div className="flex items-start justify-between gap-seek-3">
                <Heading level={3} className="text-lg">
                  {activity.title}
                </Heading>
                <Badge variant={statusVariant[activity.status]}>
                  {activity.timestamp}
                </Badge>
              </div>
              <Text variant="muted">{activity.description}</Text>
            </Stack>
          </Card>
        ))}
      </section>
    </PageContainer>
  );
}
