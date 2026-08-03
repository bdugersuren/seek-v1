"use client";

import {
  Badge,
  Button,
  Card,
  Heading,
  Icons,
  PageContainer,
  PageTitle,
  Stack,
  Text,
  useDialog,
  useToast,
} from "@seek/ui";

const organisationMetrics = [
  {
    label: "Хэрэглэгч",
    value: "126",
    description: "идэвхтэй болон уригдсан",
    tone: "text-primary",
  },
  {
    label: "Assessment",
    value: "9",
    description: "энэ сард ажиллаж буй",
    tone: "text-success",
  },
  {
    label: "Pending invite",
    value: "17",
    description: "хүлээгдэж буй урилга",
    tone: "text-warning",
  },
];

const teamRows = [
  {
    name: "Assessment team",
    members: 12,
    status: "Active",
  },
  {
    name: "HR reviewers",
    members: 6,
    status: "Reviewing",
  },
  {
    name: "Candidate cohort",
    members: 84,
    status: "Invited",
  },
];

const workspaceActions = [
  {
    title: "Candidate invite",
    description: "Шинэ cohort руу invite илгээх workflow.",
    icon: Icons.User,
  },
  {
    title: "Assessment setup",
    description: "Байгууллагын assessment template тохируулах.",
    icon: Icons.Check,
  },
  {
    title: "Report sharing",
    description: "HR болон удирдлагад report visibility тохируулах.",
    icon: Icons.Dashboard,
  },
];

export default function OrganisationsPage() {
  const { showDialog } = useDialog();
  const { showToast } = useToast();

  const openInviteDemo = () => {
    showDialog({
      title: "Candidate invite илгээх",
      description:
        "Production үед энд email list, cohort, deadline, assessment сонгох form modal байрлана.",
      confirmLabel: "Invite илгээх",
      cancelLabel: "Болих",
      onConfirm: () => showToast("Invite workflow demo ажиллалаа.", "success"),
    });
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-seek-4 lg:flex-row lg:items-start lg:justify-between">
        <PageTitle
          title="Байгууллагын удирдлага"
          subtitle="Organisation Admin-д зориулсан workspace, team, invite, report-ийн тойм."
        />
        <div className="flex flex-wrap gap-seek-2">
          <Badge>Organisation Admin</Badge>
          <Badge variant="secondary">Demo Organisation</Badge>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-seek-4 md:grid-cols-3">
        {organisationMetrics.map((metric) => (
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
                  Workspace overview
                </Heading>
                <Text variant="muted">
                  Байгууллагын team, cohort, review төлөвийн compact тойм.
                </Text>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="grid grid-cols-1 gap-seek-3">
              {teamRows.map((row) => (
                <div
                  key={row.name}
                  className="flex flex-col gap-seek-2 rounded-seek-md border border-border bg-muted-background p-seek-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <Text className="font-medium">{row.name}</Text>
                    <Text variant="muted" className="text-sm">
                      {row.members} members
                    </Text>
                  </div>
                  <Badge variant="secondary">{row.status}</Badge>
                </div>
              ))}
            </div>
          </Stack>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <Stack gap={4}>
            <Heading level={2} className="text-xl text-primary-foreground">
              Байгууллагын invite
            </Heading>
            <Text className="text-primary-foreground/85">
              Candidate болон reviewer урилга илгээх workflow modal-аар эхэлнэ.
            </Text>
            <Button type="button" variant="secondary" onClick={openInviteDemo}>
              Invite demo
            </Button>
          </Stack>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-seek-4 lg:grid-cols-3">
        {workspaceActions.map((action) => {
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
