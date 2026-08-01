import {
  Injectable,
  Inject,
  NotFoundException,
} from "@nestjs/common";
import {
  AssessmentAutosaveRequest,
  AssessmentAutosaveResponse,
  AssessmentHeartbeatRequest,
  AssessmentHeartbeatResponse,
  AssessmentRuntimeViolation,
  AssessmentSubmitRequest,
  AssessmentSubmitResponse,
  AssessmentAnswerSnapshot,
} from "@seek/contracts";
import { AttemptStateStore } from "./interfaces/state-store.interface";
import { AttemptEventPublisher } from "./interfaces/event-publisher.interface";
import { RuntimeAttempt } from "./interfaces/runtime-attempt.interface";

@Injectable()
export class ExecutionService {
  constructor(
    @Inject("AttemptStateStore")
    private readonly stateStore: AttemptStateStore,
    @Inject("AttemptEventPublisher")
    private readonly eventPublisher: AttemptEventPublisher
  ) {}

  private getRemainingSeconds(endsAt: string): number {
    const remaining = Math.max(
      0,
      Math.floor((new Date(endsAt).getTime() - Date.now()) / 1000)
    );
    return remaining;
  }

  async getSession(attemptId: string): Promise<RuntimeAttempt> {
    const session = await this.stateStore.getSession(attemptId);
    if (!session) {
      throw new NotFoundException(`Attempt session ${attemptId} not found`);
    }

    const snapshot = await this.stateStore.getAnswers(attemptId);
    const questions = await this.stateStore.getQuestions(attemptId);

    return {
      session,
      questions: questions || [],
      snapshot: snapshot || {
        attemptId,
        answers: {},
        markedForReview: {},
        localVersion: 0,
        serverVersion: 0,
        pendingSubmit: false,
      },
    };
  }

  async preloadPayload(attemptId: string): Promise<{ preloaded: boolean }> {
    const session = await this.stateStore.getSession(attemptId);
    if (!session) {
      throw new NotFoundException(`Attempt session ${attemptId} not found`);
    }
    return { preloaded: true };
  }

  async heartbeat(
    request: AssessmentHeartbeatRequest
  ): Promise<AssessmentHeartbeatResponse> {
    const session = await this.stateStore.getSession(request.attemptId);
    if (!session) {
      throw new NotFoundException(`Attempt session ${request.attemptId} not found`);
    }

    const remainingSeconds = this.getRemainingSeconds(session.endsAt);
    let status = session.status;
    let forceSubmit = false;

    if (remainingSeconds <= 0 && status === "active") {
      status = "expired";
      session.status = "expired";
      await this.stateStore.saveSession(session);
      forceSubmit = true;
    }

    // Check violation locks
    const blurViolations = await this.stateStore.getViolationCount(
      request.attemptId,
      "window_blur"
    );
    const fullscreenViolations = await this.stateStore.getViolationCount(
      request.attemptId,
      "fullscreen_exit"
    );
    const totalViolations = blurViolations + fullscreenViolations;

    let warning: string | undefined;
    if (session.proctoringPolicy.lockOnViolation && totalViolations > 0) {
      status = "locked";
      session.status = "locked";
      await this.stateStore.saveSession(session);
    } else if (
      totalViolations >= session.proctoringPolicy.maxWarningsBeforeLock
    ) {
      status = "locked";
      session.status = "locked";
      await this.stateStore.saveSession(session);
    } else if (totalViolations > 0) {
      warning = `Анхааруулга! Та ${totalViolations} удаа журам зөрчсөн байна. (${session.proctoringPolicy.maxWarningsBeforeLock} хүрвэл түгжигдэнэ)`;
    }

    const snapshot = await this.stateStore.getAnswers(request.attemptId);
    const serverVersion = snapshot ? snapshot.serverVersion : 0;

    return {
      attemptId: request.attemptId,
      serverNow: new Date().toISOString(),
      remainingSeconds,
      status,
      forceSubmit,
      warning,
      serverVersion,
    };
  }

  async autosave(
    request: AssessmentAutosaveRequest
  ): Promise<AssessmentAutosaveResponse> {
    const session = await this.stateStore.getSession(request.attemptId);
    if (!session) {
      throw new NotFoundException(`Attempt session ${request.attemptId} not found`);
    }

    if (session.status !== "active") {
      return {
        attemptId: request.attemptId,
        accepted: false,
        serverVersion: 0,
        serverSavedAt: new Date().toISOString(),
      };
    }

    let snapshot = await this.stateStore.getAnswers(request.attemptId);
    if (!snapshot) {
      snapshot = {
        attemptId: request.attemptId,
        answers: {},
        markedForReview: {},
        localVersion: 0,
        serverVersion: 0,
        pendingSubmit: false,
      };
    }

    // Version management & Idempotency check
    if (request.localVersion <= snapshot.serverVersion) {
      // Out of order or already saved version, return current server status
      return {
        attemptId: request.attemptId,
        accepted: true,
        serverVersion: snapshot.serverVersion,
        serverSavedAt: snapshot.lastSavedAt || new Date().toISOString(),
      };
    }

    // Apply changed answers
    const updatedAnswers = {
      ...snapshot.answers,
      ...request.changedAnswers,
    };

    const updatedMarkedForReview = {
      ...snapshot.markedForReview,
      ...(request.markedForReview || {}),
    };

    const serverVersion = snapshot.serverVersion + 1;
    const serverSavedAt = new Date().toISOString();

    const newSnapshot: AssessmentAnswerSnapshot = {
      attemptId: request.attemptId,
      answers: updatedAnswers,
      markedForReview: updatedMarkedForReview,
      localVersion: request.localVersion,
      serverVersion,
      lastSavedAt: serverSavedAt,
      pendingSubmit: snapshot.pendingSubmit,
    };

    await this.stateStore.saveAnswers(request.attemptId, newSnapshot);

    // Publish event asynchronously
    await this.eventPublisher.publishAnswerAutosaved({
      attemptId: request.attemptId,
      idempotencyKey: request.idempotencyKey,
      localVersion: request.localVersion,
      changedAnswers: request.changedAnswers,
      clientSavedAt: request.clientSavedAt,
      serverSavedAt,
    });

    return {
      attemptId: request.attemptId,
      accepted: true,
      serverVersion,
      serverSavedAt,
    };
  }

  async submit(
    request: AssessmentSubmitRequest
  ): Promise<AssessmentSubmitResponse> {
    const session = await this.stateStore.getSession(request.attemptId);
    if (!session) {
      throw new NotFoundException(`Attempt session ${request.attemptId} not found`);
    }

    if (
      session.status === "submitted" ||
      session.status === "expired" ||
      session.status === "locked"
    ) {
      const snapshot = await this.stateStore.getAnswers(request.attemptId);
      const totalQuestions = session.manifest.length;
      const answeredCount = snapshot
        ? Object.keys(snapshot.answers).filter((k) => snapshot.answers[k] !== null).length
        : 0;

      return {
        attemptId: request.attemptId,
        accepted: false,
        status: session.status as any,
        receiptId: `receipt-${request.attemptId}`,
        serverSubmittedAt: new Date().toISOString(),
        answeredCount,
        totalQuestions,
      };
    }

    const snapshot = await this.stateStore.getAnswers(request.attemptId);
    const finalAnswers = request.finalSnapshot.answers;
    const totalQuestions = session.manifest.length;
    const answeredCount = Object.keys(finalAnswers).filter(
      (k) => finalAnswers[k] !== null
    ).length;

    session.status = "submitted";
    await this.stateStore.saveSession(session);

    const serverSubmittedAt = new Date().toISOString();
    if (snapshot) {
      snapshot.answers = finalAnswers;
      snapshot.markedForReview = request.finalSnapshot.markedForReview;
      snapshot.pendingSubmit = false;
      await this.stateStore.saveAnswers(request.attemptId, snapshot);
    }

    // Publish event
    await this.eventPublisher.publishAttemptSubmitted({
      attemptId: request.attemptId,
      idempotencyKey: request.idempotencyKey,
      submittedAt: request.submittedAt,
      serverSubmittedAt,
      reason: request.reason,
      finalSnapshot: request.finalSnapshot,
    });

    // Request evaluation/scoring job
    await this.eventPublisher.publishScoringRequested({
      attemptId: request.attemptId,
      userId: session.userId,
      quizId: session.quizId,
      submittedAt: serverSubmittedAt,
    });

    return {
      attemptId: request.attemptId,
      accepted: true,
      status: "submitted",
      receiptId: `receipt-${request.attemptId}`,
      serverSubmittedAt,
      answeredCount,
      totalQuestions,
    };
  }

  async recordViolation(
    violation: AssessmentRuntimeViolation
  ): Promise<{ accepted: boolean }> {
    const session = await this.stateStore.getSession(violation.attemptId);
    if (!session) {
      throw new NotFoundException(`Attempt session ${violation.attemptId} not found`);
    }

    const newCount = await this.stateStore.incrementViolation(
      violation.attemptId,
      violation.type
    );

    await this.eventPublisher.publishViolationRecorded({
      attemptId: violation.attemptId,
      type: violation.type,
      occurredAt: violation.occurredAt,
      count: newCount,
      message: violation.message,
    });

    return { accepted: true };
  }

  async recoverSession(attemptId: string): Promise<RuntimeAttempt> {
    return this.getSession(attemptId);
  }
}
