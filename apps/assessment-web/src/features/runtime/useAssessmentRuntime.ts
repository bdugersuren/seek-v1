"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  AssessmentAnswerSnapshot,
  AssessmentAnswerValue,
  AssessmentAutosaveRequest,
  AssessmentHeartbeatResponse,
  AssessmentRuntimeViolation,
  AssessmentSubmitRequest,
  AssessmentSubmitResponse,
} from "@seek/contracts";
import { runtimeAdapter } from "./adapter";
import { runtimeSnapshotStorage } from "./storage";
import type { RuntimeAnswers, RuntimeAttempt } from "./types";

type QuestionSaveState = "not_visited" | "current" | "unsaved" | "saved" | "flagged" | "error";
type SaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error";

function getRemainingSeconds(endsAt: string, serverOffsetMs = 0) {
  return Math.max(
    0,
    Math.floor((new Date(endsAt).getTime() - (Date.now() + serverOffsetMs)) / 1000),
  );
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function isAnswered(value: AssessmentAnswerValue | undefined) {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === "object") return Object.keys(value).length > 0;
  return value !== null && value !== undefined && value !== "";
}

export function useAssessmentRuntime(attemptId: string) {
  const [attempt, setAttempt] = useState<RuntimeAttempt | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<RuntimeAnswers>({});
  const [localVersion, setLocalVersion] = useState(0);
  const [serverVersion, setServerVersion] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [payloadPreloaded, setPayloadPreloaded] = useState(false);
  const [unlockReceived, setUnlockReceived] = useState(false);
  const [unlockKey, setUnlockKey] = useState<string | null>(null);
  const [fullscreenActive, setFullscreenActive] = useState(false);
  const [online, setOnline] = useState(true);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [lastHeartbeat, setLastHeartbeat] =
    useState<AssessmentHeartbeatResponse | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [violations, setViolations] = useState<AssessmentRuntimeViolation[]>([]);
  const [submitted, setSubmitted] = useState<AssessmentSubmitResponse | null>(null);
  const [starting, setStarting] = useState(false);
  const [restoredFromLocal, setRestoredFromLocal] = useState(false);
  const [recovering, setRecovering] = useState(true);
  const [serverOffsetMs, setServerOffsetMs] = useState(0);
  const [dirtyQuestionIds, setDirtyQuestionIds] = useState<Record<string, boolean>>({});
  const [visitedQuestionIds, setVisitedQuestionIds] = useState<Record<string, boolean>>({});
  const [errorQuestionIds, setErrorQuestionIds] = useState<Record<string, boolean>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [savingQuestionId, setSavingQuestionId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isKnownAttempt = Boolean(attempt);
  const startsAtMs = attempt ? new Date(attempt.session.startsAt).getTime() : 0;
  const canStart =
    Boolean(attempt) &&
    (attempt?.session.status === "active" ||
      Date.now() >= startsAtMs ||
      unlockReceived);
  const currentQuestion = attempt?.questions[currentIndex] ?? attempt?.questions[0];
  const answeredCount = Object.values(answers).filter(isAnswered).length;
  const currentQuestionId = currentQuestion?.id;
  const currentSaveStatus: SaveStatus = savingQuestionId
    ? "saving"
    : currentQuestionId && errorQuestionIds[currentQuestionId]
      ? "error"
      : currentQuestionId && dirtyQuestionIds[currentQuestionId]
        ? "unsaved"
        : lastSavedAt
          ? "saved"
          : "idle";
  const hasUnsavedAnswers = Object.values(dirtyQuestionIds).some(Boolean);
  const hasSaveErrors = Object.values(errorQuestionIds).some(Boolean);

  const createSnapshot = useCallback(
    (overrides?: Partial<AssessmentAnswerSnapshot>): AssessmentAnswerSnapshot => ({
      attemptId,
      answers,
      markedForReview,
      currentQuestionId: currentQuestion?.id,
      localVersion,
      serverVersion,
      lastSavedAt: lastSavedAt ?? undefined,
      pendingSubmit,
      ...overrides,
    }),
    [
      answers,
      attemptId,
      currentQuestion?.id,
      lastSavedAt,
      localVersion,
      markedForReview,
      pendingSubmit,
      serverVersion,
    ],
  );

  const syncServerOffset = useCallback((serverNow?: string) => {
    if (!serverNow) return;
    setServerOffsetMs(new Date(serverNow).getTime() - Date.now());
  }, []);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      setRecovering(true);
      const session = await runtimeAdapter.recoverSession(attemptId);
      if (!active) return;

      setAttempt(session);
      if (session) {
        const offset = new Date(session.session.serverNow).getTime() - Date.now();
        setServerOffsetMs(offset);
        setRemainingSeconds(getRemainingSeconds(session.session.endsAt, offset));
        if (["submitted", "expired", "locked"].includes(session.session.status)) {
          setSubmitted({
            attemptId: session.session.attemptId,
            accepted: false,
            status: session.session.status as "submitted" | "expired" | "locked",
            receiptId: `receipt-${session.session.attemptId}`,
            serverSubmittedAt: session.session.serverNow,
            answeredCount: Object.values(session.snapshot.answers).filter(isAnswered).length,
            totalQuestions: session.questions.length,
          });
        }
        const restored = await runtimeSnapshotStorage.load(
          attemptId,
          unlockKey || attemptId
        );
        if (restored) {
          const expired = getRemainingSeconds(session.session.endsAt, offset) <= 0;
          setAnswers(restored.answers as RuntimeAnswers);
          setLocalVersion(restored.localVersion);
          setServerVersion(restored.serverVersion);
          setPendingSubmit(restored.pendingSubmit || expired);
          setLastSavedAt(restored.lastSavedAt ?? null);
          setMarkedForReview(restored.markedForReview ?? {});
          const restoredIndex = session.questions.findIndex(
            (question) => question.id === restored.currentQuestionId,
          );
          if (restoredIndex >= 0) setCurrentIndex(restoredIndex);
          setRestoredFromLocal(true);
        } else {
          setAnswers(session.snapshot.answers as RuntimeAnswers);
          setLocalVersion(session.snapshot.localVersion);
          setServerVersion(session.snapshot.serverVersion);
          setPendingSubmit(session.snapshot.pendingSubmit);
          setLastSavedAt(session.snapshot.lastSavedAt ?? null);
          setMarkedForReview(session.snapshot.markedForReview ?? {});
        }
      }
      setRecovering(false);
    }

    void loadSession();

    return () => {
      active = false;
    };
  }, [attemptId]);

  useEffect(() => {
    if (!attempt || recovering || !unlockReceived) return;

    const currentAttempt = attempt;
    async function loadRestoredSession() {
      const restored = await runtimeSnapshotStorage.load(attemptId, unlockKey || attemptId);
      if (restored) {
        setAnswers(restored.answers as RuntimeAnswers);
        setLocalVersion(restored.localVersion);
        setServerVersion(restored.serverVersion);
        setPendingSubmit(restored.pendingSubmit);
        setLastSavedAt(restored.lastSavedAt ?? null);
        setMarkedForReview(restored.markedForReview ?? {});
        const restoredIndex = currentAttempt.questions.findIndex(
          (question) => question.id === restored.currentQuestionId,
        );
        if (restoredIndex >= 0) setCurrentIndex(restoredIndex);
        setRestoredFromLocal(true);
      }
    }
    void loadRestoredSession();
  }, [attempt, unlockReceived, recovering, attemptId, unlockKey]);

  useEffect(() => {
    if (typeof window === "undefined" || !attemptId) return;

    const sseBaseUrl = process.env.NEXT_PUBLIC_EXECUTION_URL || "http://127.0.0.1:3010/api/v1/execution";
    const eventSource = new EventSource(`${sseBaseUrl}/sse/${attemptId}`);

    eventSource.addEventListener("unlock", (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed && parsed.unlockKey) {
          console.log("[SSE] Received unlock key:", parsed.unlockKey);
          setUnlockKey(parsed.unlockKey);
          setUnlockReceived(true);
          setAttempt((current) =>
            current
              ? {
                  ...current,
                  session: { ...current.session, status: "active" },
                }
              : current,
          );
        }
      } catch (err) {
        console.error("[SSE] Failed to parse unlock key event:", err);
      }
    });

    eventSource.onerror = (err) => {
      console.warn("[SSE] EventSource connection error or retry:", err);
    };

    return () => {
      eventSource.close();
      console.log("[SSE] EventSource connection closed");
    };
  }, [attemptId]);

  useEffect(() => {
    if (!attempt) return;

    const timer = window.setInterval(() => {
      setRemainingSeconds(getRemainingSeconds(attempt.session.endsAt, serverOffsetMs));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [attempt, serverOffsetMs]);

  useEffect(() => {
    if (!attempt) return;

    const session = attempt;
    let active = true;
    async function preload() {
      const result = await runtimeAdapter.preloadPayload(session.session.attemptId);
      if (active) setPayloadPreloaded(result.preloaded);
    }

    void preload();

    return () => {
      active = false;
    };
  }, [attempt]);

  useEffect(() => {
    if (!attempt || recovering) return;

    void runtimeSnapshotStorage.save(
      createSnapshot(),
      unlockKey || attempt.session.attemptId
    );
  }, [attempt, createSnapshot, recovering, unlockKey]);

  const statusLabel = useMemo(() => {
    if (recovering) return "Session сэргээж байна";
    if (submitted) return "Илгээгдсэн";
    if (submitting) return "Submit илгээж байна";
    if (pendingSubmit) return "Pending submit retry";
    if (!online) return "Offline local buffer";
    if (savingQuestionId) return "Хариулт хадгалж байна";
    if (hasSaveErrors) return "Хадгалалтын алдаа";
    if (hasUnsavedAnswers) return "Хадгалаагүй өөрчлөлт байна";
    if (restoredFromLocal) return "Local snapshot сэргээгдсэн";
    if (!payloadPreloaded) return "Payload татаж байна";
    if (!canStart) return "Эхлэх хугацааг хүлээж байна";
    if (lastSavedAt) return "Autosave хийгдсэн";
    return "Runtime бэлэн";
  }, [
    canStart,
    lastSavedAt,
    online,
    payloadPreloaded,
    pendingSubmit,
    recovering,
    hasSaveErrors,
    hasUnsavedAnswers,
    restoredFromLocal,
    savingQuestionId,
    submitted,
    submitting,
  ]);

  const registerViolation = useCallback(
    (type: AssessmentRuntimeViolation["type"], message: string) => {
      if (!attempt) return;

      setViolations((current) => {
        const violation = {
          attemptId: attempt.session.attemptId,
          type,
          occurredAt: new Date().toISOString(),
          count: current.length + 1,
          message,
        };
        void runtimeAdapter.recordViolation(violation);
        return [...current, violation];
      });
    },
    [attempt],
  );

  const submitAttempt = useCallback(
    async (
      reason:
        | "user_submit"
        | "timer_expired"
        | "offline_expired"
        | "policy_lock",
    ) => {
      if (!attempt || submitting || submitted) return;
      setSubmitting(true);

      const finalSnapshot = createSnapshot({ pendingSubmit: !online });
      if (!online) {
        setPendingSubmit(true);
        await runtimeSnapshotStorage.save(
          finalSnapshot,
          unlockKey || attempt.session.attemptId
        );
        setSubmitting(false);
        return;
      }

      try {
        const request: AssessmentSubmitRequest = {
          attemptId: attempt.session.attemptId,
          idempotencyKey: `submit-${attempt.session.attemptId}-${reason}-${localVersion}`,
          finalSnapshot,
          submittedAt: new Date().toISOString(),
          reason,
        };
        const response = await runtimeAdapter.submit(request);
        setPendingSubmit(false);
        setSubmitted(response);
        setAttempt((current) =>
          current
            ? {
                ...current,
                session: {
                  ...current.session,
                  status:
                    response.status === "already_submitted"
                      ? "submitted"
                      : response.status,
                },
              }
            : current,
        );
        await runtimeSnapshotStorage.clear(attempt.session.attemptId);
      } finally {
        setSubmitting(false);
      }
    },
    [attempt, createSnapshot, localVersion, online, submitted, submitting, unlockKey],
  );

  useEffect(() => {
    setOnline(navigator.onLine);

    const onOnline = () => setOnline(true);
    const onOffline = () => {
      setOnline(false);
      registerViolation("network_loss", "Сүлжээ тасарлаа. Хугацаа үргэлжилнэ.");
    };

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [registerViolation]);

  useEffect(() => {
    if (online && pendingSubmit && !submitted) {
      void submitAttempt("offline_expired");
    }
  }, [online, pendingSubmit, submitAttempt, submitted]);

  useEffect(() => {
    if (!attempt) return;

    const heartbeat = window.setInterval(() => {
      void runtimeAdapter
        .heartbeat({
          attemptId: attempt.session.attemptId,
          clientNow: new Date().toISOString(),
          localVersion,
          visible: document.visibilityState === "visible",
          fullscreen: Boolean(document.fullscreenElement),
        })
        .then((response) => {
          const nextResponse = {
            ...response,
            status: submitted
              ? "submitted"
              : !online
                ? "offline"
                : response.status,
          };
          setLastHeartbeat(nextResponse);
          syncServerOffset(nextResponse.serverNow);
          setServerVersion(nextResponse.serverVersion);
          setAttempt((current) =>
            current
              ? {
                  ...current,
                  session: {
                    ...current.session,
                    status: nextResponse.status,
                    serverNow: nextResponse.serverNow,
                  },
                }
              : current,
          );

          if (nextResponse.forceSubmit && !submitted) {
            void submitAttempt("timer_expired");
          }
        });
    }, attempt.session.heartbeatIntervalSeconds * 1000);

    return () => window.clearInterval(heartbeat);
  }, [attempt, localVersion, online, submitAttempt, submitted, syncServerOffset]);

  useEffect(() => {
    if (!attempt || !canStart) return;

    const autosave = window.setInterval(() => {
      if (submitted || pendingSubmit || !hasUnsavedAnswers) return;

      const request: AssessmentAutosaveRequest = {
        attemptId: attempt.session.attemptId,
        idempotencyKey: `autosave-${attempt.session.attemptId}-${localVersion}`,
        localVersion,
        changedAnswers: answers,
        markedForReview,
        clientSavedAt: new Date().toISOString(),
      };
      void runtimeAdapter.autosave(request).then((response) => {
        setServerVersion(response.serverVersion);
        setLastSavedAt(response.serverSavedAt);
        setDirtyQuestionIds({});
      });
    }, attempt.session.autosaveIntervalSeconds * 1000);

    return () => window.clearInterval(autosave);
  }, [
    answers,
    attempt,
    canStart,
    hasUnsavedAnswers,
    localVersion,
    markedForReview,
    pendingSubmit,
    submitted,
  ]);

  useEffect(() => {
    if (!attempt) return;

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        registerViolation("visibility_hidden", "Та шалгалтын цонхноос гарлаа.");
      }
    };
    const onBlur = () => registerViolation("window_blur", "Browser active биш боллоо.");
    const onFullscreenChange = () => {
      const active = Boolean(document.fullscreenElement);
      setFullscreenActive(active);
      if (!active && attempt.session.proctoringPolicy.requireFullscreen) {
        registerViolation("fullscreen_exit", "Fullscreen горимоос гарлаа.");
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);
    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, [attempt, registerViolation]);

  async function saveQuestion(questionId = currentQuestionId) {
    if (!attempt || !questionId || submitting || pendingSubmit) return false;
    if (attempt.session.status !== "active") {
      setSaveError("Attempt active биш байна.");
      return false;
    }

    setSavingQuestionId(questionId);
    setSaveError(null);
    try {
      const nextLocalVersion = Math.max(localVersion, serverVersion + 1);
      const request: AssessmentAutosaveRequest = {
        attemptId: attempt.session.attemptId,
        idempotencyKey: `question-save-${attempt.session.attemptId}-${questionId}-${nextLocalVersion}`,
        localVersion: nextLocalVersion,
        changedAnswers: { [questionId]: answers[questionId] ?? null },
        markedForReview,
        clientSavedAt: new Date().toISOString(),
      };
      const response = await runtimeAdapter.autosave(request);
      if (!response.accepted) throw new Error("Хариулт хадгалах боломжгүй байна.");
      setServerVersion(response.serverVersion);
      setLocalVersion((current) => Math.max(current, nextLocalVersion));
      setLastSavedAt(response.serverSavedAt);
      setDirtyQuestionIds((current) => ({ ...current, [questionId]: false }));
      setErrorQuestionIds((current) => ({ ...current, [questionId]: false }));
      return true;
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Хадгалалт амжилтгүй боллоо.");
      setErrorQuestionIds((current) => ({ ...current, [questionId]: true }));
      return false;
    } finally {
      setSavingQuestionId(null);
    }
  }

  async function goToQuestion(index: number) {
    if (!attempt || index < 0 || index >= attempt.questions.length || submitting) return;
    const activeQuestionId = currentQuestion?.id;
    if (activeQuestionId && dirtyQuestionIds[activeQuestionId]) {
      const saved = await saveQuestion(activeQuestionId);
      if (!saved) return;
    }
    setCurrentIndex(index);
    setVisitedQuestionIds((current) => ({
      ...current,
      [attempt.questions[index].id]: true,
    }));
  }

  async function saveAndNext() {
    if (!attempt || !currentQuestionId) return;
    const saved = await saveQuestion(currentQuestionId);
    if (saved && currentIndex < attempt.questions.length - 1) {
      await goToQuestion(currentIndex + 1);
    }
  }

  function toggleMarkedForReview(questionId = currentQuestionId) {
    if (!questionId) return;
    setMarkedForReview((current) => ({ ...current, [questionId]: !current[questionId] }));
  }

  function getQuestionState(questionId: string, index: number): QuestionSaveState {
    if (index === currentIndex) return "current";
    if (errorQuestionIds[questionId]) return "error";
    if (dirtyQuestionIds[questionId]) return "unsaved";
    if (markedForReview[questionId]) return "flagged";
    if (answers[questionId] !== undefined || visitedQuestionIds[questionId]) return "saved";
    return "not_visited";
  }

  function updateAnswer(questionId: string, value: AssessmentAnswerValue) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
    setLocalVersion((current) => current + 1);
    setDirtyQuestionIds((current) => ({ ...current, [questionId]: true }));
    setErrorQuestionIds((current) => ({ ...current, [questionId]: false }));
    setVisitedQuestionIds((current) => ({ ...current, [questionId]: true }));
    setSaveError(null);
  }

  async function requestFullscreen() {
    if (!document.documentElement.requestFullscreen) return;
    await document.documentElement.requestFullscreen();
  }

  function receiveMockUnlock() {
    if (!payloadPreloaded || !attempt) return;
    setUnlockKey("mock-unlock-key-123");
    setUnlockReceived(true);
  }

  async function startAttempt() {
    if (!payloadPreloaded || !attempt || starting) return;

    setStarting(true);
    try {
      const result = await runtimeAdapter.startAttempt(attempt.session.attemptId);
      syncServerOffset(result.serverNow);
      setUnlockKey(result.unlockKey);
      setUnlockReceived(true);
      setAttempt((current) =>
        current
          ? {
              ...current,
              session: {
                ...current.session,
                status: result.status,
                serverNow: result.serverNow,
              },
            }
          : current,
      );
    } finally {
      setStarting(false);
    }
  }

  return {
    attempt,
    isKnownAttempt,
    recovering,
    restoredFromLocal,
    currentIndex,
    setCurrentIndex,
    goToQuestion,
    currentQuestion,
    answers,
    updateAnswer,
    saveQuestion,
    saveAndNext,
    getQuestionState,
    toggleMarkedForReview,
    markedForReview,
    currentSaveStatus,
    savingQuestionId,
    saveError,
    hasUnsavedAnswers,
    hasSaveErrors,
    answeredCount,
    remainingSeconds,
    formattedRemaining: formatTime(remainingSeconds),
    payloadPreloaded,
    unlockReceived,
    receiveMockUnlock,
    startAttempt,
    starting,
    canStart,
    statusLabel,
    lastHeartbeat,
    lastSavedAt,
    online,
    pendingSubmit,
    submitting,
    fullscreenActive,
    requestFullscreen,
    violations,
    submitted,
    submitAttempt,
    maxWarningsBeforeLock:
      attempt?.session.proctoringPolicy.maxWarningsBeforeLock ?? 3,
  };
}
