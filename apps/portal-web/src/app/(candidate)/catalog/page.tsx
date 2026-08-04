"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  Checkbox,
  Icons,
  Input,
  PageContainer,
  Radio,
  Select,
  Text,
  useToast,
} from "@seek/ui";
import {
  catalogAssessments,
  catalogCategories,
} from "@/features/catalog/mock-data";
import { createAssessmentRuntimeUrl } from "@/features/assessment-runtime/url";
import { createCatalogAttempt } from "@/features/catalog/attempts";
import { readCatalogCart, saveCatalogCart } from "@/features/catalog/cart";
import { checkAssessmentEnrollmentGate } from "@/features/profile/api";
import type { CatalogAssessment } from "@/features/catalog/types";

type ViewMode = "card" | "list";
type ScheduleStatus = "scheduled" | "waiting" | "active" | "expired";

const sidebarItems = [
  "Бүгд",
  "Төрлөөр",
  "Чадамжаар",
  "Салбараар",
  "Байгууллагаар",
  "Зорилтот бүлгээр",
  "Миний үнэлгээ",
  "Дууссан үнэлгээ",
  "Дуртай",
] as const;

export default function CatalogPage() {
  const { showToast } = useToast();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [accessType, setAccessType] = useState("all");
  const [language, setLanguage] = useState("all");
  const [sort, setSort] = useState("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [cartItems, setCartItems] = useState<CatalogAssessment[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [scheduleDetail, setScheduleDetail] =
    useState<CatalogAssessment | null>(null);
  const [startingAssessmentId, setStartingAssessmentId] = useState<
    string | null
  >(null);

  useEffect(() => {
    setCartItems(readCatalogCart());
  }, []);

  const filteredAssessments = useMemo(() => {
    const searchText = query.trim().toLowerCase();

    return catalogAssessments
      .filter((assessment) => {
        const matchesSearch =
          !searchText ||
          assessment.title.toLowerCase().includes(searchText) ||
          assessment.description.toLowerCase().includes(searchText) ||
          assessment.competencyTags.some((tag) =>
            tag.toLowerCase().includes(searchText),
          );
        const matchesCategory =
          category === "all" || assessment.category === category;
        const matchesAccess =
          accessType === "all" || assessment.accessType === accessType;
        const matchesLanguage =
          language === "all" || assessment.language === language;

        return (
          matchesSearch && matchesCategory && matchesAccess && matchesLanguage
        );
      })
      .sort((a, b) => {
        if (sort === "price_low") {
          return a.price - b.price;
        }

        if (sort === "duration_short") {
          return a.durationMinutes - b.durationMinutes;
        }

        return 0;
      });
  }, [accessType, category, language, query, sort]);

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setAccessType("all");
    setLanguage("all");
    setSort("newest");
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const addToCart = (assessment: CatalogAssessment) => {
    if (assessment.price === 0) {
      return;
    }

    setCartItems((current) => {
      if (current.some((item) => item.id === assessment.id)) {
        showToast("Энэ үнэлгээ сагсанд байна.", "info");
        return current;
      }

      const next = [...current, assessment];
      saveCatalogCart(next);
      showToast("Үнэлгээ сагсанд нэмэгдлээ.", "success");
      return next;
    });
  };

  const removeFromCart = (assessmentId: string) => {
    setCartItems((current) => {
      const next = current.filter(
        (assessment) => assessment.id !== assessmentId,
      );
      saveCatalogCart(next);
      return next;
    });
  };

  const confirmCheckout = () => {
    setCheckoutOpen(false);
    saveCatalogCart([]);
    setCartItems([]);
    showToast("Худалдан авалт demo амжилттай боллоо.", "success");
  };

  const openScheduleOrStart = async (assessment: CatalogAssessment) => {
    if (startingAssessmentId) {
      return;
    }

    setStartingAssessmentId(assessment.id);
    try {
      const gate = await checkAssessmentEnrollmentGate(assessment);

      if (!gate.allowed) {
        setStartingAssessmentId(null);

        if (gate.blockedReason === "PROFILE_INCOMPLETE") {
          const needsPhoneVerification = gate.missingProfileFields?.includes("phoneNumberVerified");
          showToast(
            needsPhoneVerification
              ? "Үнэлгээ эхлүүлэхийн өмнө утасны дугаараа баталгаажуулна уу."
              : "Үнэлгээ эхлүүлэхийн өмнө профайлаа гүйцээнэ үү.",
            "warning",
          );
          window.location.href = needsPhoneVerification
            ? "/profile"
            : `/onboarding?redirect=${encodeURIComponent("/catalog")}`;
          return;
        }

        if (gate.blockedReason === "PAYMENT_REQUIRED") {
          addToCart(assessment);
          setCheckoutOpen(true);
          showToast("Төлбөр төлсний дараа үнэлгээнд орох боломжтой.", "info");
          return;
        }

        if (gate.blockedReason === "EMAIL_NOT_VERIFIED") {
          showToast("Үнэлгээ эхлүүлэхийн өмнө имэйл хаягаа баталгаажуулна уу.", "warning");
          window.location.href = "/verify-email";
          return;
        }

        if (gate.blockedReason === "NOT_ENROLLED") {
          showToast("Энэ үнэлгээнд эхлээд бүртгүүлэх шаардлагатай.", "info");
          setScheduleDetail(assessment);
          return;
        }

        if (gate.blockedReason === "ASSESSMENT_NOT_OPEN") {
          showToast("Энэ үнэлгээний орох хугацаа хараахан нээгдээгүй байна.", "info");
          setScheduleDetail(assessment);
          return;
        }

        if (gate.blockedReason === "ALREADY_ATTEMPTED") {
          showToast("Та энэ үнэлгээг аль хэдийн гүйцэтгэсэн байна.", "info");
          window.location.href = gate.attemptId
            ? `/take/${encodeURIComponent(gate.attemptId)}`
            : "/my-assessments";
          return;
        }

        showToast("Энэ үнэлгээнд одоогоор орох боломжгүй байна.", "warning");
        return;
      }
    } catch {
      setStartingAssessmentId(null);
      showToast("Үнэлгээний эрх шалгахад алдаа гарлаа.", "danger");
      return;
    }

    if (!canEnterWaitingRoom(assessment)) {
      setStartingAssessmentId(null);
      setScheduleDetail(assessment);
      return;
    }

    try {
      const attempt = await createCatalogAttempt({
        assessmentId: assessment.id,
        idempotencyKey:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}`,
      });

      window.location.href = createAssessmentRuntimeUrl(attempt.waitingUrl);
    } catch (error) {
      showToast("Шалгалт эхлүүлэхэд алдаа гарлаа. Дахин оролдоно уу.", "danger");
      setStartingAssessmentId(null);
    }
  };

  return (
    <PageContainer className="max-w-none bg-muted-background px-0 py-0">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="hidden border-r border-border bg-surface p-seek-4 lg:block">
          <p className="mb-seek-4 px-seek-2 text-xs font-bold uppercase text-muted-foreground">
            Үнэлгээ
          </p>
          <nav className="space-y-seek-1">
            {sidebarItems.map((item, index) => (
              <button
                key={item}
                type="button"
                className={`flex w-full items-center gap-seek-3 rounded-seek-md px-seek-3 py-seek-3 text-left text-sm font-semibold ${
                  index === 0
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-surface-hover"
                }`}
              >
                {index === 0 ? (
                  <Icons.Dashboard className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Icons.Menu className="h-4 w-4" aria-hidden="true" />
                )}
                {item}
              </button>
            ))}
          </nav>

          <div className="mt-seek-8 rounded-seek-lg bg-gradient-to-br from-primary/10 to-warning/10 p-seek-5">
            <p className="font-sans text-base font-bold text-foreground">
              Байгууллагад захиалгат үнэлгээ хийлгэх үү?
            </p>
            <Text variant="muted" className="mt-seek-2 text-sm">
              Танай байгууллагад тохирсон үнэлгээг хамтран боловсруулна.
            </Text>
            <Link
              href="/register"
              className="mt-seek-4 inline-flex w-full items-center justify-center rounded-seek-md bg-primary px-seek-4 py-seek-2 text-sm font-semibold text-primary-foreground"
            >
              Дэлгэрэнгүй →
            </Link>
          </div>
        </aside>

        <main className="grid grid-cols-1 gap-seek-5 p-seek-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-seek-5">
            <section>
              <h1 className="font-sans text-3xl font-bold text-foreground">
                Үнэлгээ
              </h1>
              <Text variant="muted" className="mt-seek-2">
                Өөрт тохирсон үнэлгээг хайж олоод эхлүүлээрэй.
              </Text>
            </section>

            <section className="space-y-seek-4">
              <div className="grid grid-cols-1 gap-seek-3 lg:grid-cols-[minmax(0,1fr)_16rem]">
                <div className="relative">
                  <Input
                    value={query}
                    placeholder="Үнэлгээний нэр, түлхүүр үг..."
                    className="pr-12"
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  <Icons.Search
                    className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <Select
                  aria-label="Эрэмбэлэх"
                  value={sort}
                  options={[
                    { value: "newest", label: "Шинэ эхэлсэн эхэнд" },
                    { value: "price_low", label: "Үнэ багаас" },
                    { value: "duration_short", label: "Хугацаа богино" },
                    { value: "popular", label: "Их сонгогдсон" },
                  ]}
                  onChange={(event) => setSort(event.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-seek-3 md:grid-cols-5">
                <FilterSelect
                  label="Төрөл"
                  value={category}
                  options={[
                    { value: "all", label: "Бүгд" },
                    { value: "knowledge", label: "Мэдлэг" },
                    { value: "skill", label: "Ур чадвар" },
                    { value: "attitude", label: "Хандлага" },
                    { value: "digital", label: "Дижитал" },
                    { value: "career", label: "Ажил мэргэжил" },
                  ]}
                  onChange={setCategory}
                />
                <FilterSelect
                  label="Хандалт"
                  value={accessType}
                  options={[
                    { value: "all", label: "Бүгд" },
                    { value: "free", label: "Төлбөргүй" },
                    { value: "paid", label: "Төлбөртэй" },
                    { value: "timed", label: "Хугацаатай" },
                    { value: "organisation", label: "Захиалгат" },
                  ]}
                  onChange={setAccessType}
                />
                <FilterSelect
                  label="Үнэ"
                  value="all"
                  options={[{ value: "all", label: "Бүгд" }]}
                  onChange={() => undefined}
                />
                <FilterSelect
                  label="Хугацаа"
                  value="all"
                  options={[{ value: "all", label: "Бүгд" }]}
                  onChange={() => undefined}
                />
                <Button type="button" variant="outline" onClick={resetFilters}>
                  Шүүлтүүр сэргээх
                </Button>
              </div>

              <div className="flex gap-seek-3 overflow-x-auto pb-seek-1">
                {catalogCategories.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`flex min-w-28 shrink-0 items-center gap-seek-3 rounded-seek-md border px-seek-4 py-seek-3 text-left transition-colors ${
                      category === item.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-surface hover:bg-surface-hover"
                    }`}
                    onClick={() => setCategory(item.id)}
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-muted-background">
                      <Icons.Dashboard className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold">
                        {item.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {item.count}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-seek-4">
              <div className="flex flex-col gap-seek-3 sm:flex-row sm:items-center sm:justify-between">
                <Text variant="muted">
                  Нийт {filteredAssessments.length} үнэлгээ
                </Text>
                <div className="flex gap-seek-2">
                  <ViewModeButton
                    active={viewMode === "card"}
                    label="Карточка"
                    onClick={() => setViewMode("card")}
                  />
                  <ViewModeButton
                    active={viewMode === "list"}
                    label="Жагсаалт"
                    onClick={() => setViewMode("list")}
                  />
                </div>
              </div>

              {viewMode === "card" ? (
                <div className="grid grid-cols-1 gap-seek-4 md:grid-cols-2 2xl:grid-cols-4">
                  {filteredAssessments.map((assessment) => (
                    <AssessmentCard
                      key={assessment.id}
                      assessment={assessment}
                      inCart={cartItems.some(
                        (item) => item.id === assessment.id,
                      )}
                      onAddToCart={addToCart}
                      onStart={openScheduleOrStart}
                      starting={startingAssessmentId === assessment.id}
                      onOpenSchedule={setScheduleDetail}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-seek-3">
                  {filteredAssessments.map((assessment) => (
                    <AssessmentListItem
                      key={assessment.id}
                      assessment={assessment}
                      inCart={cartItems.some(
                        (item) => item.id === assessment.id,
                      )}
                      onAddToCart={addToCart}
                      onStart={openScheduleOrStart}
                      starting={startingAssessmentId === assessment.id}
                      onOpenSchedule={setScheduleDetail}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="space-y-seek-4">
            <CartPanel
              items={cartItems}
              total={cartTotal}
              onRemove={removeFromCart}
              onCheckout={() => setCheckoutOpen(true)}
            />
            <FilterPanel
              accessType={accessType}
              language={language}
              onAccessTypeChange={setAccessType}
              onLanguageChange={setLanguage}
              onReset={resetFilters}
            />
          </div>
        </main>
      </div>
      {checkoutOpen && (
        <CheckoutModal
          items={cartItems}
          total={cartTotal}
          onClose={() => setCheckoutOpen(false)}
          onConfirm={confirmCheckout}
        />
      )}
      {scheduleDetail && (
        <ScheduleDetailModal
          assessment={scheduleDetail}
          onClose={() => setScheduleDetail(null)}
          onEnterWaiting={() => openScheduleOrStart(scheduleDetail)}
        />
      )}
    </PageContainer>
  );
}

function getScheduleStatus(assessment: CatalogAssessment): ScheduleStatus {
  const now = Date.now();
  const waitingRoomOpensAt = assessment.waitingRoomOpensAt
    ? new Date(assessment.waitingRoomOpensAt).getTime()
    : now;
  const startsAt = assessment.scheduledStartsAt
    ? new Date(assessment.scheduledStartsAt).getTime()
    : now;
  const endsAt = assessment.scheduledEndsAt
    ? new Date(assessment.scheduledEndsAt).getTime()
    : startsAt + assessment.durationMinutes * 60 * 1000;

  if (now >= endsAt) return "expired";
  if (now >= startsAt) return "active";
  if (now >= waitingRoomOpensAt) return "waiting";
  return "scheduled";
}

function canEnterWaitingRoom(assessment: CatalogAssessment) {
  const status = getScheduleStatus(assessment);
  return status === "waiting" || status === "active";
}

function formatDateTime(value?: string) {
  if (!value) return "Тодорхойгүй";

  return new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function scheduleStatusLabel(status: ScheduleStatus) {
  const labels: Record<ScheduleStatus, string> = {
    scheduled: "Хуваарьтай",
    waiting: "Хүлээлгийн өрөө нээгдсэн",
    active: "Үргэлжилж байна",
    expired: "Дууссан",
  };

  return labels[status];
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-seek-2 rounded-seek-md border border-border bg-surface p-seek-3">
      <span className="text-xs font-semibold text-muted-foreground">
        {label}
      </span>
      <Select
        value={value}
        options={options}
        className="border-0 px-0 py-0 font-bold focus:ring-0"
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function ViewModeButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`rounded-seek-md border px-seek-4 py-seek-2 text-sm font-semibold ${
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-surface text-muted-foreground hover:bg-surface-hover"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function AssessmentCard({
  assessment,
  inCart,
  onAddToCart,
  onStart,
  starting,
  onOpenSchedule,
}: {
  assessment: CatalogAssessment;
  inCart: boolean;
  onAddToCart: (assessment: CatalogAssessment) => void;
  onStart: (assessment: CatalogAssessment) => void;
  starting: boolean;
  onOpenSchedule: (assessment: CatalogAssessment) => void;
}) {
  const scheduleStatus = getScheduleStatus(assessment);
  const waitingAvailable = canEnterWaitingRoom(assessment);

  return (
    <article className="overflow-hidden rounded-seek-lg border border-border bg-surface shadow-seek-sm">
      <div
        className={`relative h-36 bg-gradient-to-br ${assessment.imageTone}`}
      >
        {assessment.badge && (
          <span className="absolute left-seek-3 top-seek-3 rounded-seek-md bg-primary px-seek-2 py-1 text-xs font-bold uppercase text-primary-foreground">
            {assessment.badge}
          </span>
        )}
        <button
          type="button"
          className="absolute right-seek-3 top-seek-3 grid h-8 w-8 place-items-center rounded-full bg-surface/90 text-muted-foreground"
        >
          {assessment.favorite ? "♥" : "♡"}
        </button>
      </div>
      <div className="space-y-seek-3 p-seek-4">
        <h2 className="font-sans text-lg font-bold leading-6 text-foreground">
          {assessment.title}
        </h2>
        <Text variant="muted" className="text-xs">
          {assessment.competencyTags.join(" · ")}
        </Text>
        <Text variant="muted" className="text-sm leading-6">
          {assessment.description}
        </Text>
        <div className="flex flex-wrap gap-seek-2 text-xs text-muted-foreground">
          <span>{assessment.durationMinutes} минут</span>
          <span>·</span>
          <span>{assessment.questionCount} асуулт</span>
        </div>
        <div className="rounded-seek-md border border-border bg-muted-background p-seek-3 text-xs text-muted-foreground">
          <div className="flex items-center justify-between gap-seek-2">
            <span className="font-semibold text-foreground">
              {scheduleStatusLabel(scheduleStatus)}
            </span>
            <span>{assessment.totalPoints ?? 0} оноо</span>
          </div>
          <p className="mt-1">Эхлэх: {formatDateTime(assessment.scheduledStartsAt)}</p>
          <p>Дуусах: {formatDateTime(assessment.scheduledEndsAt)}</p>
          <p>
            Хүлээлгийн өрөө: {formatDateTime(assessment.waitingRoomOpensAt)}
          </p>
          <p>Тэнцэх хувь: {assessment.passingPercent ?? 0}%</p>
        </div>
        <div className="flex items-center justify-between gap-seek-3">
          <Badge variant={assessment.price === 0 ? "success" : "warning"}>
            {assessment.accessLabel}
          </Badge>
          <span className="font-sans text-sm font-bold text-foreground">
            {assessment.price > 0
              ? `${assessment.price.toLocaleString()}₮`
              : "Үнэгүй"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-seek-2 pt-seek-2">
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center rounded-seek-md border border-primary px-seek-3 py-seek-2 text-sm font-semibold text-primary"
            onClick={(event) => {
              event.preventDefault();
              onOpenSchedule(assessment);
            }}
          >
            Дэлгэрэнгүй
          </Link>
          {assessment.price > 0 ? (
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-seek-md bg-primary px-seek-3 py-seek-2 text-sm font-semibold text-primary-foreground disabled:opacity-70"
              disabled={inCart}
              onClick={() => onAddToCart(assessment)}
            >
              {inCart ? "Сагсанд" : "Сагсанд нэмэх"}
            </button>
          ) : (
            <button
              type="button"
              disabled={starting || scheduleStatus === "expired"}
              className="inline-flex items-center justify-center rounded-seek-md bg-primary px-seek-3 py-seek-2 text-sm font-semibold text-primary-foreground"
              onClick={() => onStart(assessment)}
            >
              {starting
                ? "Эхлүүлж байна"
                : waitingAvailable
                  ? "Хүлээлгийн өрөөнд орох"
                  : "Хуваарь харах"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function AssessmentListItem({
  assessment,
  inCart,
  onAddToCart,
  onStart,
  starting,
  onOpenSchedule,
}: {
  assessment: CatalogAssessment;
  inCart: boolean;
  onAddToCart: (assessment: CatalogAssessment) => void;
  onStart: (assessment: CatalogAssessment) => void;
  starting: boolean;
  onOpenSchedule: (assessment: CatalogAssessment) => void;
}) {
  const scheduleStatus = getScheduleStatus(assessment);
  const waitingAvailable = canEnterWaitingRoom(assessment);

  return (
    <article className="grid grid-cols-1 gap-seek-4 rounded-seek-lg border border-border bg-surface p-seek-4 shadow-seek-sm md:grid-cols-[9rem_minmax(0,1fr)_10rem] md:items-center">
      <div
        className={`h-28 rounded-seek-md bg-gradient-to-br ${assessment.imageTone}`}
      />
      <div>
        <h2 className="font-sans text-lg font-bold text-foreground">
          {assessment.title}
        </h2>
        <Text variant="muted" className="mt-seek-1 text-sm">
          {assessment.description}
        </Text>
        <div className="mt-seek-3 flex flex-wrap gap-seek-2">
          <Badge variant={assessment.price === 0 ? "success" : "warning"}>
            {assessment.accessLabel}
          </Badge>
          <Badge variant="secondary">{assessment.categoryLabel}</Badge>
          {assessment.certificateAvailable && (
            <Badge variant="primary">Сертификат</Badge>
          )}
        </div>
      </div>
      <div className="space-y-seek-2 md:text-right">
        <p className="font-sans text-lg font-bold text-foreground">
          {assessment.price > 0
            ? `${assessment.price.toLocaleString()}₮`
            : "Үнэгүй"}
        </p>
        <Text variant="muted" className="text-sm">
          {assessment.durationMinutes} мин · {assessment.questionCount} асуулт
        </Text>
        <Text variant="muted" className="text-xs">
          {scheduleStatusLabel(scheduleStatus)} · Эхлэх{" "}
          {formatDateTime(assessment.scheduledStartsAt)} · Хүлээлгийн өрөө{" "}
          {formatDateTime(assessment.waitingRoomOpensAt)}
        </Text>
        <button
          type="button"
          className="text-xs font-semibold text-primary"
          onClick={() => onOpenSchedule(assessment)}
        >
          Хуваарь, заавар харах
        </button>
        {assessment.price > 0 ? (
          <Button
            type="button"
            disabled={inCart}
            onClick={() => onAddToCart(assessment)}
          >
            {inCart ? "Сагсанд" : "Сагсанд нэмэх"}
          </Button>
        ) : (
          <button
            type="button"
            disabled={starting || scheduleStatus === "expired"}
            className="inline-flex rounded-seek-md bg-primary px-seek-4 py-seek-2 text-sm font-semibold text-primary-foreground"
            onClick={() => onStart(assessment)}
          >
            {starting
              ? "Эхлүүлж байна"
              : waitingAvailable
                ? "Хүлээлгийн өрөөнд орох"
                : "Хуваарь харах"}
          </button>
        )}
      </div>
    </article>
  );
}

function ScheduleDetailModal({
  assessment,
  onClose,
  onEnterWaiting,
}: {
  assessment: CatalogAssessment;
  onClose: () => void;
  onEnterWaiting: () => void;
}) {
  const status = getScheduleStatus(assessment);
  const waitingAvailable = canEnterWaitingRoom(assessment);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-seek-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-seek-lg bg-surface p-seek-6 shadow-2xl">
        <div className="flex items-start justify-between gap-seek-4">
          <div>
            <Badge variant={waitingAvailable ? "success" : "secondary"}>
              {scheduleStatusLabel(status)}
            </Badge>
            <h2 className="mt-seek-3 font-sans text-2xl font-bold text-foreground">
              {assessment.title}
            </h2>
            <Text variant="muted" className="mt-seek-2">
              {assessment.description}
            </Text>
          </div>
          <button
            type="button"
            className="rounded-seek-md border border-border px-seek-3 py-seek-1 text-sm font-semibold"
            onClick={onClose}
          >
            Хаах
          </button>
        </div>

        <div className="mt-seek-5 grid grid-cols-1 gap-seek-3 sm:grid-cols-2">
          <ScheduleMetric label="Эхлэх" value={formatDateTime(assessment.scheduledStartsAt)} />
          <ScheduleMetric label="Дуусах" value={formatDateTime(assessment.scheduledEndsAt)} />
          <ScheduleMetric
            label="Хүлээлгийн өрөө"
            value={formatDateTime(assessment.waitingRoomOpensAt)}
          />
          <ScheduleMetric
            label="Урьдчилан нэвтрэх"
            value={`${assessment.requiredEarlyJoinMinutes ?? 0} минутын өмнө`}
          />
          <ScheduleMetric label="Үргэлжлэх хугацаа" value={`${assessment.durationMinutes} минут`} />
          <ScheduleMetric
            label="Асуулт / оноо / тэнцэх"
            value={`${assessment.questionCount} асуулт · ${assessment.totalPoints ?? 0} оноо · ${
              assessment.passingPercent ?? 0
            }%`}
          />
        </div>

        <div className="mt-seek-5 rounded-seek-md bg-muted-background p-seek-4">
          <Text className="font-bold">Нэвтрэх нөхцөл</Text>
          <Text variant="muted" className="mt-seek-2 text-sm leading-6">
            Хүлээлгийн өрөө нээгдсэн үед quiz runtime рүү шилжинэ. Тэнд
            payload readiness, төхөөрөмжийн төлөв, заавартай танилцсан эсэхийг
            шалгаад эхлэх цаг болоход тест нээгдэнэ.
          </Text>
        </div>

        <div className="mt-seek-6 grid grid-cols-1 gap-seek-3 sm:grid-cols-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Буцах
          </Button>
          <Button
            type="button"
            disabled={!waitingAvailable}
            onClick={onEnterWaiting}
          >
            {waitingAvailable
              ? "Хүлээлгийн өрөөнд орох"
              : `Хүлээлгийн өрөө ${formatDateTime(
                  assessment.waitingRoomOpensAt,
                )}-д нээгдэнэ`}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ScheduleMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-seek-md border border-border p-seek-3">
      <Text variant="muted" className="text-xs uppercase">
        {label}
      </Text>
      <Text className="mt-1 font-semibold">{value}</Text>
    </div>
  );
}

function CartPanel({
  items,
  total,
  onRemove,
  onCheckout,
}: {
  items: CatalogAssessment[];
  total: number;
  onRemove: (assessmentId: string) => void;
  onCheckout: () => void;
}) {
  return (
    <aside className="rounded-seek-lg border border-border bg-surface p-seek-4 shadow-seek-sm">
      <div className="flex items-center justify-between gap-seek-3">
        <h2 className="font-sans text-xl font-bold text-foreground">Сагс</h2>
        <Badge variant="secondary">{items.length}</Badge>
      </div>
      {items.length === 0 ? (
        <Text variant="muted" className="mt-seek-4 text-sm">
          Төлбөртэй үнэлгээ сонгож сагсанд нэмнэ үү.
        </Text>
      ) : (
        <div className="mt-seek-4 space-y-seek-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-seek-md border border-border p-seek-3"
            >
              <div className="flex items-start justify-between gap-seek-3">
                <p className="font-sans text-sm font-bold text-foreground">
                  {item.title}
                </p>
                <button
                  type="button"
                  className="text-xs font-bold text-danger"
                  onClick={() => onRemove(item.id)}
                >
                  ×
                </button>
              </div>
              <Text variant="muted" className="mt-seek-1 text-xs">
                {item.durationMinutes} мин · {item.questionCount} асуулт
              </Text>
              <p className="mt-seek-2 font-sans text-sm font-bold text-foreground">
                {item.price.toLocaleString()}₮
              </p>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-border pt-seek-3">
            <Text className="font-bold">Нийт</Text>
            <Text className="font-bold">{total.toLocaleString()}₮</Text>
          </div>
          <Button type="button" className="w-full" onClick={onCheckout}>
            Худалдан авах
          </Button>
        </div>
      )}
    </aside>
  );
}

function CheckoutModal({
  items,
  total,
  onClose,
  onConfirm,
}: {
  items: CatalogAssessment[];
  total: number;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-seek-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-seek-lg bg-surface p-seek-6 shadow-2xl">
        <h2 className="font-sans text-2xl font-bold text-foreground">
          Худалдан авалт баталгаажуулах
        </h2>
        <Text variant="muted" className="mt-seek-2">
          Prototype үед checkout local demo байдлаар ажиллана.
        </Text>
        <div className="mt-seek-5 space-y-seek-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-seek-3 rounded-seek-md bg-muted-background p-seek-3"
            >
              <span className="text-sm font-semibold">{item.title}</span>
              <span className="text-sm font-bold">
                {item.price.toLocaleString()}₮
              </span>
            </div>
          ))}
        </div>
        <div className="mt-seek-5 flex items-center justify-between border-t border-border pt-seek-4">
          <Text className="font-bold">Төлөх дүн</Text>
          <Text className="text-xl font-bold text-primary">
            {total.toLocaleString()}₮
          </Text>
        </div>
        <div className="mt-seek-6 grid grid-cols-1 gap-seek-3 sm:grid-cols-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Буцах
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={items.length === 0}
          >
            Төлбөр төлөх
          </Button>
        </div>
      </div>
    </div>
  );
}

function FilterPanel({
  accessType,
  language,
  onAccessTypeChange,
  onLanguageChange,
  onReset,
}: {
  accessType: string;
  language: string;
  onAccessTypeChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onReset: () => void;
}) {
  return (
    <aside className="rounded-seek-lg border border-border bg-surface p-seek-4 shadow-seek-sm xl:sticky xl:top-seek-4 xl:h-fit">
      <div className="flex items-center justify-between gap-seek-3">
        <h2 className="font-sans text-xl font-bold text-foreground">
          Шүүлтүүр
        </h2>
        <button
          type="button"
          className="text-xs font-semibold text-primary"
          onClick={onReset}
        >
          Бүгдийг арилгах
        </button>
      </div>

      <div className="mt-seek-5 space-y-seek-5">
        <FilterGroup title="Үнэлгээний төрөл">
          {[
            "Мэдлэг",
            "Ур чадвар",
            "Хандлага",
            "Дижитал ур чадвар",
            "Ажил мэргэжил",
            "Бусад",
          ].map((item) => (
            <Checkbox key={item} label={item} />
          ))}
        </FilterGroup>

        <FilterGroup title="Хандалтын төрөл">
          {[
            { value: "all", label: "Бүгд" },
            { value: "free", label: "Төлбөргүй" },
            { value: "paid", label: "Төлбөртэй" },
            { value: "timed", label: "Хугацаатай" },
            { value: "organisation", label: "Байгууллагын захиалгат" },
          ].map((item) => (
            <label key={item.value} className="flex items-center gap-seek-2">
              <Radio
                name="accessType"
                checked={accessType === item.value}
                onChange={() => onAccessTypeChange(item.value)}
              />
              <span className="text-sm">{item.label}</span>
            </label>
          ))}
        </FilterGroup>

        <FilterGroup title="Үнэ">
          {[
            "Бүгд",
            "Төлбөргүй",
            "0₮ - 10,000₮",
            "10,000₮ - 50,000₮",
            "50,000₮ дээш",
          ].map((item) => (
            <Radio
              key={item}
              name="price"
              label={item}
              defaultChecked={item === "Бүгд"}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Хэл">
          {[
            { value: "all", label: "Бүгд" },
            { value: "mn", label: "Монгол" },
            { value: "en", label: "English" },
          ].map((item) => (
            <label key={item.value} className="flex items-center gap-seek-2">
              <Radio
                name="language"
                checked={language === item.value}
                onChange={() => onLanguageChange(item.value)}
              />
              <span className="text-sm">{item.label}</span>
            </label>
          ))}
        </FilterGroup>
      </div>
    </aside>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-seek-3 font-sans text-sm font-bold text-foreground">
        {title}
      </h3>
      <div className="space-y-seek-2">{children}</div>
    </section>
  );
}
