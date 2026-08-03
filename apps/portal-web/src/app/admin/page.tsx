"use client";

import {
  Badge,
  Button,
  Card,
  Heading,
  Icons,
  PageContainer,
  PageTitle,
  ProgressBar,
  Stack,
  Text,
  useDialog,
  useToast,
} from "@seek/ui";

const platformMetrics = [
  {
    label: "Байгууллага",
    value: "18",
    description: "идэвхтэй tenant",
    tone: "text-primary",
  },
  {
    label: "Service health",
    value: "96%",
    description: "auth/gateway/portal readiness",
    tone: "text-success",
  },
  {
    label: "Pending approval",
    value: "7",
    description: "tenant болон billing review",
    tone: "text-warning",
  },
];

const serviceStatuses = [
  { name: "Auth service", status: "Healthy", value: 98 },
  { name: "Gateway", status: "Healthy", value: 96 },
  { name: "Portal web", status: "Ready", value: 92 },
];

const platformActions = [
  {
    title: "Tenant approval",
    description: "Шинээр хүсэлт гаргасан байгууллагуудыг хянах.",
    icon: Icons.Check,
  },
  {
    title: "Security review",
    description: "Auth, session, role boundary review queue харах.",
    icon: Icons.Shield,
  },
  {
    title: "Platform settings",
    description: "Global feature flag болон service тохиргоо удирдах.",
    icon: Icons.Settings,
  },
];

export default function AdminPage() {
  const { showDialog } = useDialog();
  const { showToast } = useToast();

  const openDangerDemo = () => {
    showDialog({
      title: "Platform action баталгаажуулах",
      description:
        "Production үед энэ modal tenant suspend, billing lock зэрэг эрсдэлтэй action дээр ашиглагдана.",
      confirmLabel: "Баталгаажуулах",
      cancelLabel: "Болих",
      onConfirm: () =>
        showToast("Platform admin action баталгаажлаа.", "success"),
    });
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-seek-4 lg:flex-row lg:items-start lg:justify-between">
        <PageTitle
          title="Платформын удирдлага"
          subtitle="Super Admin-д зориулсан global tenant, service health, security review тойм."
        />
        <div className="flex flex-wrap gap-seek-2">
          <Badge>Super Admin</Badge>
          <Badge variant="secondary">seek.mn Platform</Badge>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-seek-4 md:grid-cols-3">
        {platformMetrics.map((metric) => (
          <Card key={metric.label}>
            <Stack gap={2}>
              <Text variant="muted" className="text-sm font-medium">
                {metric.label}
              </Text>
              <Text className={`text-3xl font-bold ${metric.tone}`}>
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
                  Platform readiness
                </Heading>
                <Text variant="muted">
                  Нүүр хуудасны clean SaaS style-тай нийцсэн service readiness
                  overview.
                </Text>
              </div>
              <Badge variant="success">Healthy</Badge>
            </div>
            <Stack gap={4}>
              {serviceStatuses.map((service) => (
                <div key={service.name}>
                  <div className="mb-seek-2 flex items-center justify-between gap-seek-3">
                    <Text className="font-medium">{service.name}</Text>
                    <Text variant="muted" className="text-sm">
                      {service.status}
                    </Text>
                  </div>
                  <ProgressBar value={service.value} />
                </div>
              ))}
            </Stack>
          </Stack>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <Stack gap={4}>
            <Heading level={2} className="text-xl text-primary-foreground">
              Global admin action
            </Heading>
            <Text className="text-primary-foreground/85">
              Эрсдэлтэй platform action-ууд confirm modal-оор баталгаажих ёстой.
            </Text>
            <Button type="button" variant="secondary" onClick={openDangerDemo}>
              Confirm action demo
            </Button>
          </Stack>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-seek-4 lg:grid-cols-3">
        {platformActions.map((action) => {
          const Icon = action.icon;

          return (
            <Card key={action.title}>
              <Stack gap={4}>
                <div className="flex h-12 w-12 items-center justify-center rounded-seek-md bg-cyan-600 text-white shadow-seek-sm">
                  <Icon size={26} />
                </div>
                <Stack gap={2}>
                  <Heading level={3} className="text-lg">
                    {action.title}
                  </Heading>
                  <Text variant="muted">{action.description}</Text>
                </Stack>
              </Stack>
            </Card>
          );
        })}
      </section>
    </PageContainer>
  );
}
