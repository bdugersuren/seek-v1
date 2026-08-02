import { BadRequestException, NotFoundException } from "@nestjs/common";
import { ExecutionService } from "../src/execution.service";
import { InMemoryAttemptEventPublisher } from "../src/infrastructure/in-memory-event-publisher";
import { InMemoryAttemptStateStore } from "../src/infrastructure/in-memory-state-store";
import { SseService } from "../src/infrastructure/sse.service";

describe("ExecutionService attempt creation", () => {
  let service: ExecutionService;
  let store: InMemoryAttemptStateStore;

  beforeEach(() => {
    store = new InMemoryAttemptStateStore();
    service = new ExecutionService(
      store,
      new InMemoryAttemptEventPublisher(),
      new SseService(),
    );
  });

  it("creates an attempt for a supported catalog assessment", async () => {
    const result = await service.createAttempt({
      assessmentId: "data-analysis-basic",
      idempotencyKey: "test-key-001",
    });

    expect(result).toEqual({
      attemptId: "attempt-data-analysis-basic-test-key-001",
      quizId: "quiz-data-analysis-basic",
      waitingUrl: "/waiting/attempt-data-analysis-basic-test-key-001",
      status: "waiting",
    });

    const runtime = await service.getSession(result.attemptId);
    expect(runtime.session.status).toBe("waiting");
    expect(runtime.session.userId).toBe("candidate-001");
    expect(runtime.questions).toHaveLength(3);
    expect(runtime.snapshot.attemptId).toBe(result.attemptId);
  });

  it("returns not found for unsupported catalog assessments", async () => {
    await expect(
      service.createAttempt({ assessmentId: "unknown-assessment" }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("starts a waiting attempt and makes the runtime session active", async () => {
    const created = await service.createAttempt({
      assessmentId: "english-basic",
      idempotencyKey: "start-key-001",
    });

    const started = await service.startAttempt(created.attemptId);
    expect(started.status).toBe("active");
    expect(started.unlockKey).toContain(created.attemptId);

    const runtime = await service.getSession(created.attemptId);
    expect(runtime.session.status).toBe("active");

    const audit = await service.getAuditEvents(created.attemptId);
    expect(audit.some((event) => event.type === "AttemptStarted")).toBe(true);
    expect(audit.some((event) => event.type === "UnlockKeyDelivered")).toBe(true);
  });

  it("does not start an attempt before the scheduled start time", async () => {
    const created = await service.createAttempt({
      assessmentId: "data-analysis-basic",
      idempotencyKey: "scheduled-key-001",
    });

    await expect(service.startAttempt(created.attemptId)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it("returns not found when starting an unknown attempt", async () => {
    await expect(service.startAttempt("missing-attempt")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("autosubmits an expired active attempt with the saved snapshot", async () => {
    const created = await service.createAttempt({
      assessmentId: "english-basic",
      idempotencyKey: "autosubmit-key-001",
    });
    await service.startAttempt(created.attemptId);

    const runtime = await service.getSession(created.attemptId);
    runtime.session.endsAt = new Date(Date.now() - 1000).toISOString();
    await store.saveSession(runtime.session);

    const result = await service.submit({
      attemptId: created.attemptId,
      idempotencyKey: "timer-expired-submit-001",
      finalSnapshot: {
        attemptId: created.attemptId,
        answers: { q1: "a" },
        markedForReview: {},
        localVersion: 1,
        serverVersion: 0,
        pendingSubmit: false,
      },
      submittedAt: new Date().toISOString(),
      reason: "timer_expired",
    });

    expect(result.accepted).toBe(true);
    expect(result.status).toBe("submitted");

    const receipt = await service.getReceipt(created.attemptId);
    expect(receipt.submitted).toBe(true);
    expect(receipt.receiptId).toContain(created.attemptId);
  });

  it("rejects manual submit and autosave after the server deadline", async () => {
    const created = await service.createAttempt({
      assessmentId: "english-basic",
      idempotencyKey: "expired-policy-key-001",
    });
    await service.startAttempt(created.attemptId);

    const runtime = await service.getSession(created.attemptId);
    runtime.session.endsAt = new Date(Date.now() - 1000).toISOString();
    await store.saveSession(runtime.session);

    const save = await service.autosave({
      attemptId: created.attemptId,
      idempotencyKey: "late-save-001",
      localVersion: 1,
      changedAnswers: { q1: "a" },
      clientSavedAt: new Date().toISOString(),
    });
    expect(save.accepted).toBe(false);

    const submit = await service.submit({
      attemptId: created.attemptId,
      idempotencyKey: "late-manual-submit-001",
      finalSnapshot: {
        attemptId: created.attemptId,
        answers: { q1: "a" },
        markedForReview: {},
        localVersion: 1,
        serverVersion: 0,
        pendingSubmit: false,
      },
      submittedAt: new Date().toISOString(),
      reason: "user_submit",
    });
    expect(submit.accepted).toBe(false);
    expect(submit.status).toBe("expired");
  });

  it("records preload, instruction acknowledgement, heartbeat and navigation audit", async () => {
    const created = await service.createAttempt({
      assessmentId: "english-basic",
      idempotencyKey: "audit-key-001",
    });

    const preload = await service.preloadPayload(created.attemptId, {
      idempotencyKey: "preload-001",
      clientInstanceId: "client-1",
    });
    expect(preload.preloaded).toBe(true);
    expect(preload.payloadHash).toContain("sha256:");

    await service.acknowledgeInstructions(created.attemptId, {
      instructionHash: "sha256:instructions",
      acceptedBy: "candidate-001",
      idempotencyKey: "ack-001",
    });
    await service.startAttempt(created.attemptId, {
      idempotencyKey: "start-001",
    });
    await service.heartbeat({
      attemptId: created.attemptId,
      clientNow: new Date().toISOString(),
      localVersion: 0,
      visible: true,
      fullscreen: true,
    });
    await service.navigate(created.attemptId, {
      toQuestionId: "q2",
      clientSequence: 1,
      idempotencyKey: "nav-001",
      saveRequired: true,
      saveSucceeded: true,
    });

    const audit = await service.getAuditEvents(created.attemptId);
    expect(audit.map((event) => event.type)).toEqual(
      expect.arrayContaining([
        "PayloadPreloaded",
        "InstructionsAcknowledged",
        "HeartbeatReceived",
        "NavigationChanged",
      ])
    );
  });

  it("deduplicates repeated autosave idempotency keys", async () => {
    const created = await service.createAttempt({
      assessmentId: "english-basic",
      idempotencyKey: "dedupe-key-001",
    });
    await service.startAttempt(created.attemptId);

    const first = await service.autosave({
      attemptId: created.attemptId,
      idempotencyKey: "save-same-key",
      localVersion: 1,
      changedAnswers: { q1: "a" },
      clientSavedAt: new Date().toISOString(),
    });
    const second = await service.autosave({
      attemptId: created.attemptId,
      idempotencyKey: "save-same-key",
      localVersion: 2,
      changedAnswers: { q2: ["a", "b"] },
      clientSavedAt: new Date().toISOString(),
    });

    expect(first.serverVersion).toBe(1);
    expect(second.serverVersion).toBe(1);
    const runtime = await service.getSession(created.attemptId);
    expect(runtime.snapshot.answers).toEqual({ q1: "a" });
  });

  it("returns the same accepted receipt for duplicate submit idempotency keys", async () => {
    const created = await service.createAttempt({
      assessmentId: "english-basic",
      idempotencyKey: "submit-dedupe-key-001",
    });
    await service.startAttempt(created.attemptId);

    const request = {
      attemptId: created.attemptId,
      idempotencyKey: "submit-same-key",
      finalSnapshot: {
        attemptId: created.attemptId,
        answers: { q1: "a" },
        markedForReview: {},
        localVersion: 1,
        serverVersion: 0,
        pendingSubmit: false,
      },
      submittedAt: new Date().toISOString(),
      reason: "user_submit" as const,
    };

    const first = await service.submit(request);
    const second = await service.submit(request);

    expect(first.accepted).toBe(true);
    expect(second.accepted).toBe(true);
    expect(second.receiptId).toBe(first.receiptId);
  });
});
