import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { createHash } from "crypto";
import {
  AssessmentAnswerSnapshot,
  AssessmentAutosaveRequest,
  AssessmentAutosaveResponse,
  AssessmentHeartbeatRequest,
  AssessmentHeartbeatResponse,
  AssessmentQuestionType,
  AssessmentRuntimeViolation,
  AssessmentRuntimeSession,
  AssessmentSubmitRequest,
  AssessmentSubmitResponse,
  CreateAssessmentAttemptRequest,
  CreateAssessmentAttemptResponse,
  StartAssessmentAttemptResponse,
} from "@seek/contracts";
import { AttemptStateStore } from "./interfaces/state-store.interface";
import { AttemptEventPublisher } from "./interfaces/event-publisher.interface";
import { RuntimeAttempt } from "./interfaces/runtime-attempt.interface";
import { SseService } from "./infrastructure/sse.service";

@Injectable()
export class ExecutionService {
  constructor(
    @Inject("AttemptStateStore")
    private readonly stateStore: AttemptStateStore,
    @Inject("AttemptEventPublisher")
    private readonly eventPublisher: AttemptEventPublisher,
    private readonly sseService: SseService
  ) {}

  private createEventId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  private hashPayload(payload: unknown): string {
    return `sha256:${createHash("sha256")
      .update(JSON.stringify(payload))
      .digest("hex")}`;
  }

  private async appendAuditEvent(
    attemptId: string,
    type: string,
    payload: Record<string, unknown>,
    idempotencyKey?: string
  ): Promise<void> {
    await this.stateStore.appendAuditEvent({
      id: this.createEventId(type.toLowerCase()),
      attemptId,
      type,
      idempotencyKey,
      payload: {
        ...payload,
        payloadChecksum: this.hashPayload(payload),
      },
      occurredAt: new Date().toISOString(),
    });
  }

  private getRemainingSeconds(endsAt: string): number {
    const remaining = Math.max(
      0,
      Math.floor((new Date(endsAt).getTime() - Date.now()) / 1000)
    );
    return remaining;
  }

  private getSupportedAssessment(assessmentId: string) {
    const assessments: Record<
      string,
      {
        quizId: string;
        title: string;
        durationMinutes: number;
        startsInMinutes: number;
        requiredEarlyJoinMinutes: number;
        questionCount: number;
        totalPoints: number;
        passingPercent: number;
      }
    > = {
      "data-analysis-basic": {
        quizId: "quiz-data-analysis-basic",
        title: "Мэдээллийн шинжилгээний үндэс",
        durationMinutes: 45,
        startsInMinutes: 20,
        requiredEarlyJoinMinutes: 15,
        questionCount: 60,
        totalPoints: 100,
        passingPercent: 70,
      },
      "teamwork-skill": {
        quizId: "quiz-teamwork-skill",
        title: "Багаар ажиллах ур чадвар",
        durationMinutes: 35,
        startsInMinutes: 90,
        requiredEarlyJoinMinutes: 15,
        questionCount: 35,
        totalPoints: 80,
        passingPercent: 65,
      },
      "english-basic": {
        quizId: "quiz-english-basic",
        title: "Англи хэлний суурь мэдлэг",
        durationMinutes: 40,
        startsInMinutes: -10,
        requiredEarlyJoinMinutes: 15,
        questionCount: 50,
        totalPoints: 100,
        passingPercent: 60,
      },
    };

    return assessments[assessmentId] || null;
  }

  private createAttemptId(assessmentId: string, idempotencyKey?: string): string {
    const suffix = (idempotencyKey || `${Date.now()}`)
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 32);

    return `attempt-${assessmentId}-${suffix || Date.now()}`;
  }

  private createMockQuestions(): Array<{
    id: string;
    code: string;
    prompt: string;
    instruction: string;
    type: AssessmentQuestionType;
    points: number;
    options?: Array<{ id: string; label: string }>;
  }> {
    return [
      {
        id: "q1",
        code: "Q1",
        prompt: "Монгол Улсын Үндсэн хуулийн үндсэн зарчимд аль нь хамаарах вэ?",
        instruction: "Нэг зөв хариулт сонгоно уу.",
        type: "single_choice",
        points: 2,
        options: [
          { id: "a", label: "Ардчилсан ёс" },
          { id: "b", label: "Зөвхөн эдийн засгийн өсөлт" },
          { id: "c", label: "Нууц захиргаа" },
          { id: "d", label: "Хувийн ашиг сонирхол" },
        ],
      },
      {
        id: "q2",
        code: "Q2",
        prompt: "Төрийн үйлчилгээний чанарыг сайжруулахад нөлөөлөх хүчин зүйлсийг сонго.",
        instruction: "Нийт хамаарах хариултыг сонгоно уу.",
        type: "multiple_choice",
        points: 3,
        options: [
          { id: "a", label: "Ил тод байдал" },
          { id: "b", label: "Хариуцлага" },
          { id: "c", label: "Иргэн төвтэй үйлчилгээ" },
          { id: "d", label: "Мэдээллийг зориуд нуух" },
        ],
      },
      {
        id: "q3",
        code: "Q3",
        prompt: "Иргэн үйлчилгээ авах явцад олон шат дамжлага үүсэж байгаа нөхцөлд сайжруулах саналаа тайлбарлана уу.",
        instruction: "Бүтэцтэй, үндэслэлтэй хариулт бичнэ үү.",
        type: "essay",
        points: 10,
      },
    ];
  }

  async createAttempt(
    request: CreateAssessmentAttemptRequest
  ): Promise<CreateAssessmentAttemptResponse> {
    const assessment = this.getSupportedAssessment(request.assessmentId);
    if (!assessment) {
      throw new NotFoundException(
        `Assessment ${request.assessmentId} is not supported for attempt creation`
      );
    }

    const now = new Date();
    const startsAt = new Date(now.getTime() + assessment.startsInMinutes * 60 * 1000);
    const endsAt = new Date(
      startsAt.getTime() + assessment.durationMinutes * 60 * 1000
    );
    const waitingRoomOpensAt = new Date(
      startsAt.getTime() - assessment.requiredEarlyJoinMinutes * 60 * 1000
    );
    const attemptId = this.createAttemptId(
      request.assessmentId,
      request.idempotencyKey
    );

    if (
      request.idempotencyKey &&
      (await this.stateStore.getSession(attemptId))
    ) {
      return {
        attemptId,
        quizId: assessment.quizId,
        waitingUrl: `/waiting/${attemptId}`,
        status: "waiting",
      };
    }
    const questions = this.createMockQuestions();

    const session: AssessmentRuntimeSession = {
      attemptId,
      quizId: assessment.quizId,
      assessmentTitle: assessment.title,
      userId: "candidate-001",
      userDisplayName: "Demo Candidate",
      serverNow: now.toISOString(),
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      durationSeconds: assessment.durationMinutes * 60,
      status: "waiting",
      autosaveIntervalSeconds: 5,
      heartbeatIntervalSeconds: 5,
      scheduledStartsAt: startsAt.toISOString(),
      scheduledEndsAt: endsAt.toISOString(),
      waitingRoomOpensAt: waitingRoomOpensAt.toISOString(),
      requiredEarlyJoinMinutes: assessment.requiredEarlyJoinMinutes,
      questionCount: assessment.questionCount,
      totalPoints: assessment.totalPoints,
      passingPercent: assessment.passingPercent,
      encryptedPayload: {
        payloadId: `payload-${attemptId}`,
        quizId: assessment.quizId,
        attemptId,
        algorithm: "AES-GCM",
        keyDelivery: "start_unlock_event",
        encryptedContent: "mock.encrypted.payload",
        iv: "mock-iv",
        checksum: "sha256:mock-checksum",
        createdAt: now.toISOString(),
      },
      manifest: questions.map((question, index) => ({
        id: question.id,
        code: question.code,
        type: question.type,
        sectionId: index < 2 ? "sec-general" : "sec-application",
        sectionName: index < 2 ? "Ерөнхий мэдлэг" : "Хэрэглээ",
        order: index + 1,
        points: question.points,
        required: true,
      })),
      proctoringPolicy: {
        requireFullscreen: true,
        warnOnVisibilityChange: true,
        warnOnWindowBlur: true,
        disableCopyPaste: true,
        disableContextMenu: true,
        maxWarningsBeforeLock: 3,
        lockOnViolation: true,
      },
      resultVisibilityPolicy: {
        hideSolutions: true,
        showLeaderboard: false,
        showScore: true,
        showCorrectness: false,
        showCorrectAnswers: false,
        showExplanations: false,
        resultReleaseMode: "after_close",
      },
    };

    const snapshot: AssessmentAnswerSnapshot = {
      attemptId,
      answers: {},
      markedForReview: {},
      localVersion: 0,
      serverVersion: 0,
      pendingSubmit: false,
    };

    await this.stateStore.saveSession(session);
    await this.stateStore.saveAnswers(attemptId, snapshot);
    await this.stateStore.saveQuestions(attemptId, questions);
    await this.appendAuditEvent(
      attemptId,
      "AttemptCreated",
      {
        assessmentId: request.assessmentId,
        quizId: assessment.quizId,
        status: session.status,
        waitingRoomOpensAt: session.waitingRoomOpensAt,
      },
      request.idempotencyKey
    );

    return {
      attemptId,
      quizId: assessment.quizId,
      waitingUrl: `/waiting/${attemptId}`,
      status: session.status,
    };
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

  async preloadPayload(
    attemptId: string,
    body?: { idempotencyKey?: string; clientInstanceId?: string }
  ): Promise<{ preloaded: boolean; payloadHash: string; receiptId: string }> {
    const session = await this.stateStore.getSession(attemptId);
    if (!session) {
      throw new NotFoundException(`Attempt session ${attemptId} not found`);
    }
    const payloadHash = session.encryptedPayload?.checksum || this.hashPayload(session.manifest);
    const idempotencyKey = body?.idempotencyKey || `preload:${payloadHash}`;

    if (!(await this.stateStore.hasIdempotencyKey(attemptId, idempotencyKey))) {
      await this.appendAuditEvent(
        attemptId,
        "PayloadPreloaded",
        {
          payloadHash,
          clientInstanceId: body?.clientInstanceId,
          keyDelivery: session.encryptedPayload?.keyDelivery,
        },
        idempotencyKey
      );
    }

    return {
      preloaded: true,
      payloadHash,
      receiptId: `preload-${attemptId}-${payloadHash.replace(/[^a-zA-Z0-9]/g, "").slice(0, 16)}`,
    };
  }

  private createUnlockKey(attemptId: string): string {
    return `unlock-${attemptId}-${Date.now()}`;
  }

  async acknowledgeInstructions(
    attemptId: string,
    body: {
      instructionHash: string;
      policyVersion?: string;
      acceptedBy?: string;
      idempotencyKey?: string;
    }
  ): Promise<{ accepted: boolean }> {
    const session = await this.stateStore.getSession(attemptId);
    if (!session) {
      throw new NotFoundException(`Attempt session ${attemptId} not found`);
    }

    const idempotencyKey =
      body.idempotencyKey || `ack:${body.instructionHash}:${body.acceptedBy || session.userId}`;
    if (!(await this.stateStore.hasIdempotencyKey(attemptId, idempotencyKey))) {
      await this.appendAuditEvent(
        attemptId,
        "InstructionsAcknowledged",
        {
          instructionHash: body.instructionHash,
          policyVersion: body.policyVersion || "v1",
          acceptedBy: body.acceptedBy || session.userId,
        },
        idempotencyKey
      );
    }

    return { accepted: true };
  }

  async startAttempt(
    attemptId: string,
    body?: { idempotencyKey?: string; clientNow?: string }
  ): Promise<StartAssessmentAttemptResponse> {
    const session = await this.stateStore.getSession(attemptId);
    if (!session) {
      throw new NotFoundException(`Attempt session ${attemptId} not found`);
    }

    const scheduledStartsAt = session.scheduledStartsAt || session.startsAt;
    if (Date.now() < new Date(scheduledStartsAt).getTime()) {
      throw new BadRequestException("Attempt is not ready to start yet");
    }

    if (!["submitted", "expired", "locked"].includes(session.status)) {
      const previousStatus = session.status;
      session.status = "active";
      session.startsAt = new Date().toISOString();
      session.endsAt = new Date(
        Date.now() + session.durationSeconds * 1000
      ).toISOString();
      await this.stateStore.saveSession(session);
      await this.appendAuditEvent(
        attemptId,
        "AttemptStarted",
        {
          previousStatus,
          newStatus: session.status,
          clientNow: body?.clientNow,
          serverStartedAt: session.startsAt,
        },
        body?.idempotencyKey || `start:${attemptId}`
      );
    }

    const unlockKey = this.createUnlockKey(attemptId);
    this.sseService.emitUnlock(attemptId, unlockKey);
    await this.appendAuditEvent(
      attemptId,
      "UnlockKeyDelivered",
      {
        unlockKeyHash: this.hashPayload(unlockKey),
        serverNow: new Date().toISOString(),
      },
      `unlock:${unlockKey}`
    );

    return {
      attemptId,
      quizId: session.quizId,
      status: session.status,
      unlockKey,
      serverNow: new Date().toISOString(),
    };
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
    const serverNow = new Date().toISOString();
    const clientClockSkewMs = request.clientNow
      ? Date.now() - new Date(request.clientNow).getTime()
      : undefined;

    await this.appendAuditEvent(request.attemptId, "HeartbeatReceived", {
      clientNow: request.clientNow,
      localVersion: request.localVersion,
      visible: request.visible,
      fullscreen: request.fullscreen,
      online: true,
      clientClockSkewMs,
      remainingSeconds,
      status,
      warning,
      serverVersion,
    });

    return {
      attemptId: request.attemptId,
      serverNow,
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

    if (this.getRemainingSeconds(session.endsAt) <= 0 && session.status === "active") {
      session.status = "expired";
      await this.stateStore.saveSession(session);
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
    if (await this.stateStore.hasIdempotencyKey(request.attemptId, request.idempotencyKey)) {
      return {
        attemptId: request.attemptId,
        accepted: true,
        serverVersion: snapshot.serverVersion,
        serverSavedAt: snapshot.lastSavedAt || new Date().toISOString(),
      };
    }

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
    await this.appendAuditEvent(
      request.attemptId,
      "AnswerAutosaveApplied",
      {
        localVersion: request.localVersion,
        serverVersion,
        changedQuestionIds: Object.keys(request.changedAnswers),
        markedForReviewQuestionIds: Object.keys(request.markedForReview || {}),
        clientSavedAt: request.clientSavedAt,
        serverSavedAt,
      },
      request.idempotencyKey
    );

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

  async navigate(
    attemptId: string,
    body: {
      fromQuestionId?: string;
      toQuestionId: string;
      clientSequence: number;
      idempotencyKey: string;
      saveRequired?: boolean;
      saveSucceeded?: boolean;
      clientOccurredAt?: string;
    }
  ): Promise<{ accepted: boolean }> {
    const session = await this.stateStore.getSession(attemptId);
    if (!session) {
      throw new NotFoundException(`Attempt session ${attemptId} not found`);
    }
    const knownQuestion = session.manifest.some(
      (question) => question.id === body.toQuestionId
    );
    if (!knownQuestion) {
      throw new BadRequestException("Target question is not part of this attempt");
    }
    if (!(await this.stateStore.hasIdempotencyKey(attemptId, body.idempotencyKey))) {
      await this.appendAuditEvent(
        attemptId,
        "NavigationChanged",
        {
          fromQuestionId: body.fromQuestionId,
          toQuestionId: body.toQuestionId,
          clientSequence: body.clientSequence,
          saveRequired: body.saveRequired || false,
          saveSucceeded: body.saveSucceeded,
          clientOccurredAt: body.clientOccurredAt,
        },
        body.idempotencyKey
      );
    }
    return { accepted: true };
  }

  async submit(
    request: AssessmentSubmitRequest
  ): Promise<AssessmentSubmitResponse> {
    const session = await this.stateStore.getSession(request.attemptId);
    if (!session) {
      throw new NotFoundException(`Attempt session ${request.attemptId} not found`);
    }

    const terminalStatus =
      session.status === "submitted" ||
      session.status === "expired" ||
      session.status === "locked";
    const isExpirySubmit =
      request.reason === "timer_expired" || request.reason === "offline_expired";

    if (await this.stateStore.hasIdempotencyKey(request.attemptId, request.idempotencyKey)) {
      const submissions = await this.stateStore.getAuditEvents(
        request.attemptId,
        "AttemptSubmitted"
      );
      const previous = submissions.find(
        (event) => event.idempotencyKey === request.idempotencyKey
      );
      const snapshot = await this.stateStore.getAnswers(request.attemptId);
      return {
        attemptId: request.attemptId,
        accepted: true,
        status: session.status as any,
        receiptId:
          (previous?.payload.receiptId as string | undefined) ||
          `receipt-${request.attemptId}`,
        serverSubmittedAt:
          (previous?.payload.serverSubmittedAt as string | undefined) ||
          new Date().toISOString(),
        answeredCount: snapshot
          ? Object.keys(snapshot.answers).filter((k) => snapshot.answers[k] !== null).length
          : 0,
        totalQuestions: session.manifest.length,
      };
    }

    if (terminalStatus && !(session.status === "expired" && isExpirySubmit)) {
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

    const remainingSeconds = this.getRemainingSeconds(session.endsAt);
    if (remainingSeconds <= 0 && session.status === "active") {
      session.status = "expired";
    }
    if (session.status === "expired" && !isExpirySubmit) {
      const snapshot = await this.stateStore.getAnswers(request.attemptId);
      return {
        attemptId: request.attemptId,
        accepted: false,
        status: "expired",
        receiptId: `receipt-${request.attemptId}`,
        serverSubmittedAt: new Date().toISOString(),
        answeredCount: snapshot
          ? Object.keys(snapshot.answers).filter((k) => snapshot.answers[k] !== null).length
          : 0,
        totalQuestions: session.manifest.length,
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
    const receiptId = `receipt-${request.attemptId}-${this.hashPayload({
      idempotencyKey: request.idempotencyKey,
      answeredCount,
      totalQuestions,
    }).slice(-12)}`;

    await this.appendAuditEvent(
      request.attemptId,
      "AttemptSubmitted",
      {
        reason: request.reason,
        submittedAt: request.submittedAt,
        serverSubmittedAt,
        answeredCount,
        totalQuestions,
        receiptId,
        finalSnapshotHash: this.hashPayload(request.finalSnapshot),
      },
      request.idempotencyKey
    );

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
      receiptId,
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

    if (newCount >= session.proctoringPolicy.maxWarningsBeforeLock) {
      const previousStatus = session.status;
      session.status = "locked";
      await this.stateStore.saveSession(session);
      await this.appendAuditEvent(violation.attemptId, "AttemptLocked", {
        previousStatus,
        newStatus: "locked",
        violationType: violation.type,
        violationCount: newCount,
        reason: violation.message,
      });
    }

    await this.appendAuditEvent(violation.attemptId, "ViolationRecorded", {
      type: violation.type,
      occurredAt: violation.occurredAt,
      count: newCount,
      message: violation.message,
    });

    return { accepted: true };
  }

  async recoverSession(attemptId: string): Promise<RuntimeAttempt> {
    await this.appendAuditEvent(attemptId, "AttemptRecovered", {
      recoveredAt: new Date().toISOString(),
    });
    return this.getSession(attemptId);
  }

  async getReceipt(attemptId: string): Promise<{
    attemptId: string;
    submitted: boolean;
    receiptId?: string;
    submittedAt?: string;
  }> {
    const session = await this.stateStore.getSession(attemptId);
    if (!session) {
      throw new NotFoundException(`Attempt session ${attemptId} not found`);
    }
    const submissions = await this.stateStore.getAuditEvents(
      attemptId,
      "AttemptSubmitted"
    );
    const latest = submissions[submissions.length - 1];
    return {
      attemptId,
      submitted: submissions.length > 0,
      receiptId: latest?.payload.receiptId as string | undefined,
      submittedAt: latest?.payload.serverSubmittedAt as string | undefined,
    };
  }

  async getAuditEvents(attemptId: string) {
    return this.stateStore.getAuditEvents(attemptId);
  }
}
