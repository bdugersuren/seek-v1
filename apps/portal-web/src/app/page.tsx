"use client";

import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  Heading,
  Icons,
  Select,
  Stack,
  Text,
} from "@seek/ui";
import { locales, type Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/use-t";

const audienceItems = [
  {
    titleKey: "home.audience.publicServant.title",
    descriptionKey: "home.audience.publicServant.description",
    icon: Icons.User,
    tone: "from-teal-400 to-cyan-600",
  },
  {
    titleKey: "home.audience.students.title",
    descriptionKey: "home.audience.students.description",
    icon: Icons.Dashboard,
    tone: "from-blue-500 to-indigo-600",
  },
  {
    titleKey: "home.audience.teachers.title",
    descriptionKey: "home.audience.teachers.description",
    icon: Icons.Info,
    tone: "from-violet-500 to-purple-700",
  },
  {
    titleKey: "home.audience.leaders.title",
    descriptionKey: "home.audience.leaders.description",
    icon: Icons.Calendar,
    tone: "from-orange-400 to-orange-600",
  },
  {
    titleKey: "home.audience.groups.title",
    descriptionKey: "home.audience.groups.description",
    icon: Icons.User,
    tone: "from-pink-500 to-rose-600",
  },
] as const;

const navItems = [
  { labelKey: "home.nav.home", href: "/" },
  { labelKey: "home.nav.catalog", href: "/catalog" },
  { labelKey: "home.nav.pricing", href: "#pricing" },
  { labelKey: "home.nav.organisationOrder", href: "#organisation-order" },
  { labelKey: "home.nav.news", href: "#news" },
  { labelKey: "home.nav.help", href: "#help" },
] as const;

const featureItems = [
  {
    titleKey: "home.feature.types.title",
    descriptionKey: "home.feature.types.description",
    icon: Icons.Menu,
  },
  {
    titleKey: "home.feature.target.title",
    descriptionKey: "home.feature.target.description",
    icon: Icons.Search,
  },
  {
    titleKey: "home.feature.flexible.title",
    descriptionKey: "home.feature.flexible.description",
    icon: Icons.Calendar,
  },
  {
    titleKey: "home.feature.certificate.title",
    descriptionKey: "home.feature.certificate.description",
    icon: Icons.Dashboard,
  },
  {
    titleKey: "home.feature.reports.title",
    descriptionKey: "home.feature.reports.description",
    icon: Icons.Check,
  },
] as const;

const workflowItems = [
  {
    titleKey: "home.workflow.register.title",
    descriptionKey: "home.workflow.register.description",
    icon: Icons.User,
  },
  {
    titleKey: "home.workflow.choose.title",
    descriptionKey: "home.workflow.choose.description",
    icon: Icons.Search,
  },
  {
    titleKey: "home.workflow.take.title",
    descriptionKey: "home.workflow.take.description",
    icon: Icons.Check,
  },
  {
    titleKey: "home.workflow.results.title",
    descriptionKey: "home.workflow.results.description",
    icon: Icons.Dashboard,
  },
  {
    titleKey: "home.workflow.certificate.title",
    descriptionKey: "home.workflow.certificate.description",
    icon: Icons.Info,
  },
] as const;

const popularAssessments = [
  {
    titleKey: "home.assessment.publicServant",
    tagKey: "home.tag.paid",
    tagVariant: "warning",
    questions: 120,
    minutes: 90,
    price: "10,000₮",
  },
  {
    titleKey: "home.assessment.student",
    tagKey: "home.tag.free",
    tagVariant: "success",
    questions: 80,
    minutes: 60,
    priceKey: "home.free",
  },
  {
    titleKey: "home.assessment.teacher",
    tagKey: "home.tag.custom",
    tagVariant: "primary",
    questions: 100,
    minutes: 90,
    price: "15,000₮",
  },
  {
    titleKey: "home.assessment.leadership",
    tagKey: "home.tag.timed",
    tagVariant: "danger",
    questions: 90,
    minutes: 75,
    price: "12,000₮",
  },
] as const;

const stats = [
  { value: "10,000+", labelKey: "home.stats.users", icon: Icons.User },
  { value: "500+", labelKey: "home.stats.types", icon: Icons.Check },
  { value: "200+", labelKey: "home.stats.orders", icon: Icons.Calendar },
  { value: "50,000+", labelKey: "home.stats.certificates", icon: Icons.Info },
] as const;

export default function HomePage() {
  const { locale, setLocale, t } = useI18n();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-header border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-seek-4 px-seek-4 sm:px-seek-6 lg:px-seek-8">
          <Link href="/" className="flex items-center gap-seek-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-seek-md border border-border bg-muted-background text-primary">
              <Icons.Dashboard size={24} />
            </div>
            <div className="leading-tight">
              <Text className="font-bold text-primary">
                {t("home.brandTitle")}
              </Text>
              <Text variant="muted" className="text-[11px] uppercase">
                {t("home.brandSubtitle")}
              </Text>
            </div>
          </Link>

          <nav className="hidden items-center gap-seek-6 lg:flex">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  index === 0 ? "text-primary" : "text-foreground"
                }`}
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-seek-2">
            <Select
              aria-label={t("common.language")}
              className="hidden w-20 text-sm sm:block"
              value={locale}
              onChange={(event) => setLocale(event.target.value as Locale)}
              options={locales.map((item) => ({
                value: item,
                label: item.toUpperCase(),
              }))}
            />
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-seek-md border border-border bg-surface px-seek-4 py-seek-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {t("login.submit")}
            </Link>
            <Link
              href="/register"
              className="hidden items-center justify-center rounded-seek-md bg-primary px-seek-4 py-seek-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary sm:inline-flex"
            >
              {t("login.registerLink")}
            </Link>
          </div>
        </div>
      </header>

      <section className="overflow-hidden bg-gradient-to-br from-background via-surface to-muted-background">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-seek-10 px-seek-4 py-seek-12 sm:px-seek-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(24rem,1.1fr)] lg:px-seek-8 lg:py-seek-16">
          <Stack gap={6}>
            <Stack gap={3}>
              <Heading level={1} className="text-4xl font-bold lg:text-5xl">
                {t("home.heroTitleLine1")}
                <span className="block text-primary">
                  {t("home.heroTitleLine2")}
                </span>
              </Heading>
              <Text variant="muted" className="max-w-xl text-lg">
                {t("home.heroSubtitle")}
              </Text>
            </Stack>
            <div className="flex flex-col gap-seek-3 sm:flex-row">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center rounded-seek-md bg-primary px-seek-4 py-seek-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {t("home.heroPrimary")}
              </Link>
              <Button type="button" variant="outline">
                {t("home.heroSecondary")}
              </Button>
            </div>
          </Stack>

          <div className="relative min-h-[18rem]">
            <div className="absolute right-0 top-4 hidden h-24 w-24 rounded-full border-[18px] border-primary/10 lg:block" />
            <Card className="relative mx-auto max-w-xl border-primary/10 shadow-seek-lg">
              <Stack gap={4}>
                <div className="flex items-center justify-between border-b border-border pb-seek-3">
                  <div>
                    <Text className="font-semibold">Dashboard preview</Text>
                    <Text variant="muted" className="text-sm">
                      Competency analytics
                    </Text>
                  </div>
                  <Badge variant="success">87%</Badge>
                </div>
                <div className="grid grid-cols-3 gap-seek-3">
                  <div className="col-span-2 rounded-seek-md bg-muted-background p-seek-4">
                    <div className="mb-seek-3 h-3 w-24 rounded-full bg-primary/20" />
                    <div className="flex h-28 items-end gap-seek-2">
                      {[35, 48, 42, 61, 55, 73].map((height) => (
                        <div
                          key={height}
                          className="w-full rounded-t-seek-md bg-primary/70"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-seek-3">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="rounded-seek-md border border-border bg-surface p-seek-3"
                      >
                        <div className="mb-seek-2 h-2 w-12 rounded-full bg-primary/20" />
                        <div className="h-2 w-20 rounded-full bg-muted-background" />
                      </div>
                    ))}
                  </div>
                </div>
              </Stack>
            </Card>
          </div>
        </div>
      </section>

      <section id="audience" className="bg-surface py-seek-10 lg:py-seek-12">
        <div className="mx-auto max-w-7xl px-seek-4 sm:px-seek-6 lg:px-seek-8">
          <Heading level={2} className="mb-seek-8 text-center text-2xl">
            {t("home.audienceTitle")}
          </Heading>
          <div className="grid grid-cols-1 gap-seek-4 sm:grid-cols-2 lg:grid-cols-5">
            {audienceItems.map((item) => {
              const Icon = item.icon;

              return (
                <Card
                  key={item.titleKey}
                  className="min-h-[13rem] rounded-seek-lg border-border bg-surface text-center shadow-seek-sm"
                >
                  <Stack gap={4} align="center">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${item.tone} text-white shadow-seek-md`}
                    >
                      <Icon size={30} />
                    </div>
                    <Stack gap={2} align="center">
                      <Heading level={3} className="text-base">
                        {t(item.titleKey)}
                      </Heading>
                      <Text variant="muted" className="text-sm leading-6">
                        {t(item.descriptionKey)}
                      </Text>
                    </Stack>
                  </Stack>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-muted-background py-seek-10 lg:py-seek-12">
        <div className="mx-auto max-w-7xl px-seek-4 sm:px-seek-6 lg:px-seek-8">
          <Heading level={2} className="mb-seek-8 text-center text-2xl">
            {t("home.featuresTitle")}
          </Heading>
          <div className="grid grid-cols-1 gap-seek-6 md:grid-cols-3 lg:grid-cols-5">
            {featureItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <div key={item.titleKey} className="relative text-center">
                  {index > 0 && (
                    <div className="absolute left-0 top-0 hidden h-full border-l border-border lg:block" />
                  )}
                  <Stack
                    gap={3}
                    align="center"
                    className="mx-auto max-w-[12rem] px-seek-2"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-seek-md bg-cyan-600 text-white shadow-seek-sm">
                      <Icon size={30} />
                    </div>
                    <Heading level={3} className="text-base">
                      {t(item.titleKey)}
                    </Heading>
                    <Text variant="muted" className="text-sm leading-6">
                      {t(item.descriptionKey)}
                    </Text>
                  </Stack>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-surface py-seek-10 lg:py-seek-12">
        <div className="mx-auto max-w-7xl px-seek-4 sm:px-seek-6 lg:px-seek-8">
          <Heading level={2} className="mb-seek-8 text-center text-2xl">
            {t("home.workflowTitle")}
          </Heading>
          <div className="grid grid-cols-1 gap-seek-6 md:grid-cols-5">
            {workflowItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <div key={item.titleKey} className="relative text-center">
                  {index < workflowItems.length - 1 && (
                    <div className="absolute left-1/2 top-6 hidden w-full translate-x-6 border-t border-dashed border-muted md:block" />
                  )}
                  <Stack
                    gap={3}
                    align="center"
                    className="relative mx-auto max-w-[12rem]"
                  >
                    <div className="z-base flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400 text-lg font-bold text-white shadow-seek-sm">
                      {index + 1}
                    </div>
                    <div className="z-base flex h-16 w-16 items-center justify-center rounded-seek-lg border border-border bg-surface text-cyan-700 shadow-seek-sm">
                      <Icon size={30} />
                    </div>
                    <Heading level={3} className="text-base">
                      {t(item.titleKey)}
                    </Heading>
                    <Text variant="muted" className="text-sm leading-6">
                      {t(item.descriptionKey)}
                    </Text>
                  </Stack>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="popular" className="bg-muted-background py-seek-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-seek-4 px-seek-4 sm:px-seek-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-seek-8">
          <div className="rounded-seek-lg bg-surface p-seek-5 shadow-seek-sm">
            <div className="mb-seek-5 flex items-center justify-between gap-seek-4">
              <Heading level={2} className="text-2xl">
                {t("home.popularTitle")}
              </Heading>
              <Link
                href="/catalog"
                className="text-sm font-medium text-primary"
              >
                {t("home.viewAll")} →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-seek-3 md:grid-cols-2 xl:grid-cols-4">
              {popularAssessments.map((assessment) => (
                <Card key={assessment.titleKey} className="shadow-none">
                  <Stack gap={3}>
                    <Badge variant={assessment.tagVariant}>
                      {t(assessment.tagKey)}
                    </Badge>
                    <Heading level={3} className="text-base leading-6">
                      {t(assessment.titleKey)}
                    </Heading>
                    <div className="flex flex-wrap gap-seek-3 text-xs text-muted">
                      <span>
                        {assessment.questions} {t("home.questions")}
                      </span>
                      <span>
                        {assessment.minutes} {t("home.minutes")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-seek-3 pt-seek-2">
                      <Text className="font-bold text-primary">
                        {"priceKey" in assessment
                          ? t(assessment.priceKey)
                          : assessment.price}
                      </Text>
                      <Link
                        href="/catalog"
                        className="rounded-seek-md border border-border px-seek-3 py-seek-1.5 text-xs font-medium hover:bg-surface-hover"
                      >
                        {t("home.detail")}
                      </Link>
                    </div>
                  </Stack>
                </Card>
              ))}
            </div>
          </div>

          <Card
            id="organisation-order"
            className="bg-primary text-primary-foreground shadow-seek-md"
          >
            <Stack gap={5}>
              <Stack gap={2}>
                <Heading level={2} className="text-xl text-primary-foreground">
                  {t("home.orgOrderTitle")}
                </Heading>
                <Text className="text-primary-foreground/85">
                  {t("home.orgOrderDescription")}
                </Text>
              </Stack>
              <Link
                href="/register"
                className="inline-flex w-fit items-center justify-center rounded-seek-md bg-surface px-seek-4 py-seek-2 text-sm font-medium text-primary transition-colors hover:bg-muted-background focus:outline-none focus:ring-2 focus:ring-primary-foreground"
              >
                {t("home.orgOrderButton")}
              </Link>
              <div className="ml-auto flex h-20 w-28 items-end gap-seek-2 opacity-80">
                {[52, 72, 92].map((height) => (
                  <div
                    key={height}
                    className="w-full rounded-t-seek-md bg-white/30"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </Stack>
          </Card>
        </div>
      </section>

      <section className="bg-surface py-seek-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-seek-4 px-seek-4 sm:grid-cols-2 sm:px-seek-6 lg:grid-cols-4 lg:px-seek-8">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.labelKey}
                className="flex items-center justify-center gap-seek-3 border-border py-seek-2 lg:border-r last:lg:border-r-0"
              >
                <Icon size={28} className="text-foreground" />
                <div>
                  <Text className="font-bold">{item.value}</Text>
                  <Text variant="muted" className="text-sm">
                    {t(item.labelKey)}
                  </Text>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
