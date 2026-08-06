import { Injectable, NotFoundException } from "@nestjs/common";
import {
  AssessmentRuntimeSession,
  AssessmentAnswerSnapshot,
} from "@seek/contracts";
import {
  AttemptAuditEvent,
  AttemptStateStore,
} from "../interfaces/state-store.interface";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaAttemptStateStore implements AttemptStateStore {
  constructor(private readonly prisma: PrismaService) {}

  private mapStatusToPrisma(status: string): any {
    switch (status) {
      case "waiting":
        return "CREATED";
      case "active":
        return "IN_PROGRESS";
      case "submitted":
        return "SUBMITTED";
      case "expired":
        return "EXPIRED";
      case "locked":
        return "LOCKED";
      case "cancelled":
        return "CANCELLED";
      case "invalidated":
        return "INVALIDATED";
      default:
        return "CREATED";
    }
  }

  private mapPrismaToStatus(status: any): string {
    switch (status) {
      case "CREATED":
        return "waiting";
      case "IN_PROGRESS":
        return "active";
      case "SUBMITTED":
        return "submitted";
      case "EXPIRED":
        return "expired";
      case "LOCKED":
        return "locked";
      case "CANCELLED":
        return "cancelled";
      case "INVALIDATED":
        return "invalidated";
      default:
        return "waiting";
    }
  }

  async getSession(attemptId: string): Promise<AssessmentRuntimeSession | null> {
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: { questions: { orderBy: { orderIndex: "asc" } } },
    });

    if (!attempt) {
      // Seed mock data for local testing fallback matching Redis state store behavior
      if (attemptId === "mock-attempt-001") {
        return this.getMockSession();
      }
      return null;
    }

    const scheduleSnapshot = (attempt.scheduleSnapshot as any) || {};

    return {
      attemptId: attempt.id,
      quizId: attempt.quizId,
      assessmentTitle: scheduleSnapshot.title || "Шалгалт",
      userId: attempt.candidateId,
      userDisplayName: scheduleSnapshot.candidateDisplayName || "Сургуулагч",
      serverNow: new Date().toISOString(),
      startsAt: attempt.startedAt?.toISOString() || attempt.createdAt.toISOString(),
      endsAt: attempt.expiresAt?.toISOString() || new Date(attempt.createdAt.getTime() + attempt.durationLimitSeconds * 1000).toISOString(),
      durationSeconds: attempt.durationLimitSeconds,
      status: this.mapPrismaToStatus(attempt.status) as any,
      autosaveIntervalSeconds: scheduleSnapshot.autosaveIntervalSeconds || 10,
      heartbeatIntervalSeconds: scheduleSnapshot.heartbeatIntervalSeconds || 15,
      scheduledStartsAt: attempt.startedAt?.toISOString() || attempt.createdAt.toISOString(),
      scheduledEndsAt: attempt.expiresAt?.toISOString() || new Date(attempt.createdAt.getTime() + attempt.durationLimitSeconds * 1000).toISOString(),
      waitingRoomOpensAt: attempt.startedAt ? new Date(attempt.startedAt.getTime() - 15 * 60 * 1000).toISOString() : undefined,
      requiredEarlyJoinMinutes: 15,
      questionCount: attempt.questions.length,
      totalPoints: attempt.questions.reduce((sum, q) => sum + Number(q.maxScoreSnapshot || 0), 0),
      passingPercent: 70,
      encryptedPayload: {
        payloadId: `payload-${attempt.id}`,
        quizId: attempt.quizId,
        attemptId: attempt.id,
        algorithm: "AES-GCM",
        keyDelivery: "start_unlock_event",
        encryptedContent: "mock.encrypted.payload",
        iv: "mock-iv",
        checksum: "sha256:mock-checksum",
        createdAt: attempt.createdAt.toISOString(),
      },
      manifest: attempt.questions.map((q) => ({
        id: q.questionId,
        code: q.questionCodeSnapshot || `Q-${q.orderIndex}`,
        type: q.questionTypeCodeSnapshot as any,
        sectionId: q.quizRevisionSectionId,
        sectionName: q.sectionTitleSnapshot || "Ерөнхий хэсэг",
        order: q.orderIndex,
        points: Number(q.maxScoreSnapshot || 0),
        required: q.isRequired,
      })),
      proctoringPolicy: (attempt.proctoringPolicySnapshot as any) || {
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
      deviceFingerprintHash: attempt.deviceFingerprintHash,
    } as any;
  }

  async saveSession(session: AssessmentRuntimeSession): Promise<void> {
    const prismaStatus = this.mapStatusToPrisma(session.status);
    
    // Check if attempt exists
    const existing = await this.prisma.quizAttempt.findUnique({
      where: { id: session.attemptId },
    });

    const dataPayload = {
      quizId: session.quizId,
      quizRevisionId: session.quizId,
      scheduleId: session.quizId,
      assignmentId: `assign-${session.attemptId}`,
      candidateId: session.userId,
      attemptNumber: 1,
      status: prismaStatus,
      durationLimitSeconds: session.durationSeconds,
      startedAt: session.startsAt ? new Date(session.startsAt) : undefined,
      expiresAt: session.endsAt ? new Date(session.endsAt) : undefined,
      scheduleSnapshot: {
        title: session.assessmentTitle,
        candidateDisplayName: session.userDisplayName,
        autosaveIntervalSeconds: session.autosaveIntervalSeconds,
        heartbeatIntervalSeconds: session.heartbeatIntervalSeconds,
      } as any,
      proctoringPolicySnapshot: session.proctoringPolicy as any,
      deviceFingerprintHash: (session as any).deviceFingerprintHash || undefined,
    };

    if (existing) {
      await this.prisma.quizAttempt.update({
        where: { id: session.attemptId },
        data: dataPayload,
      });
    } else {
      await this.prisma.quizAttempt.create({
        data: {
          id: session.attemptId,
          ...dataPayload,
        },
      });
    }
  }

  async getAnswers(attemptId: string): Promise<AssessmentAnswerSnapshot | null> {
    const snapshot = await this.prisma.attemptStateSnapshot.findUnique({
      where: { attemptId },
    });

    if (!snapshot) {
      if (attemptId === "mock-attempt-001") {
        return this.getMockSnapshot();
      }
      return null;
    }

    return {
      attemptId: snapshot.attemptId,
      answers: (snapshot.answers as any) || {},
      markedForReview: (snapshot.markedForReview as any) || {},
      localVersion: snapshot.lastClientSequence || 0,
      serverVersion: snapshot.lastResponseServerVersion || 0,
      pendingSubmit: snapshot.pendingSubmitReason ? true : false,
      lastSavedAt: snapshot.updatedAt.toISOString(),
    };
  }

  async saveAnswers(
    attemptId: string,
    snapshot: AssessmentAnswerSnapshot
  ): Promise<void> {
    // 1. Update AttemptStateSnapshot
    await this.prisma.attemptStateSnapshot.upsert({
      where: { attemptId },
      update: {
        answers: snapshot.answers as any,
        markedForReview: snapshot.markedForReview as any,
        lastClientSequence: snapshot.localVersion,
        lastResponseServerVersion: snapshot.serverVersion,
        pendingSubmitReason: snapshot.pendingSubmit ? "PENDING" : null,
      },
      create: {
        attemptId,
        answers: snapshot.answers as any,
        markedForReview: snapshot.markedForReview as any,
        lastClientSequence: snapshot.localVersion,
        lastResponseServerVersion: snapshot.serverVersion,
        pendingSubmitReason: snapshot.pendingSubmit ? "PENDING" : null,
      },
    });

    // 2. Sync to QuestionResponse database table
    const attemptQuestions = await this.prisma.attemptQuestion.findMany({
      where: { attemptId },
    });

    for (const q of attemptQuestions) {
      const ansVal = snapshot.answers[q.questionId];
      if (ansVal !== undefined) {
        await this.prisma.questionResponse.upsert({
          where: { attemptQuestionId: q.id },
          update: {
            answerValue: ansVal as any,
            lastClientSequence: snapshot.localVersion,
            answerStatus: "SAVED",
          },
          create: {
            attemptId,
            attemptQuestionId: q.id,
            answerValue: ansVal as any,
            lastClientSequence: snapshot.localVersion,
            answerStatus: "SAVED",
          },
        });
      }
    }
  }

  async saveQuestions(attemptId: string, questions: any[]): Promise<void> {
    for (let index = 0; index < questions.length; index++) {
      const question = questions[index];
      const dataPayload = {
        questionId: question.id,
        questionVersionId: question.id,
        quizRevisionSectionId: question.sectionId || "default-section",
        sectionTitleSnapshot: question.sectionName || "Ерөнхий",
        questionCodeSnapshot: question.code,
        orderIndex: question.order || question.orderIndex || (index + 1),
        maxScoreSnapshot: question.points || 0,
        questionTypeCodeSnapshot: question.type,
        contentSnapshot: { prompt: question.prompt, instruction: question.instruction } as any,
        optionsSnapshot: (question.options || []) as any,
      };

      // Check if attempt question already exists
      const existing = await this.prisma.attemptQuestion.findFirst({
        where: { attemptId, questionId: question.id },
      });

      if (existing) {
        await this.prisma.attemptQuestion.update({
          where: { id: existing.id },
          data: dataPayload,
        });
      } else {
        await this.prisma.attemptQuestion.create({
          data: {
            attemptId,
            ...dataPayload,
          },
        });
      }
    }
  }

  async incrementViolation(attemptId: string, type: string): Promise<number> {
    const violation = await this.prisma.quizViolation.create({
      data: {
        attemptId,
        violationType: type,
        severity: "WARNING",
        decisionStatus: "RECORDED",
      },
    });

    const count = await this.prisma.quizViolation.count({
      where: { attemptId, violationType: type },
    });

    return count;
  }

  async getViolationCount(attemptId: string, type: string): Promise<number> {
    const count = await this.prisma.quizViolation.count({
      where: { attemptId, violationType: type },
    });
    return count;
  }

  async getQuestions(attemptId: string): Promise<any[] | null> {
    const attemptQuestions = await this.prisma.attemptQuestion.findMany({
      where: { attemptId },
      orderBy: { orderIndex: "asc" },
    });

    if (attemptQuestions.length === 0) {
      if (attemptId === "mock-attempt-001") {
        return this.getMockQuestions();
      }
      return null;
    }

    return attemptQuestions.map((q) => {
      const content = (q.contentSnapshot as any) || {};
      return {
        id: q.questionId,
        code: q.questionCodeSnapshot,
        prompt: content.prompt || "",
        instruction: content.instruction || "",
        type: q.questionTypeCodeSnapshot,
        points: Number(q.maxScoreSnapshot),
        options: q.optionsSnapshot || [],
      };
    });
  }

  async appendAuditEvent(event: AttemptAuditEvent): Promise<void> {
    const occurredAtDate = new Date(event.occurredAt);

    if (event.type === "HeartbeatReceived") {
      await this.prisma.attemptHeartbeatEvent.create({
        data: {
          attemptId: event.attemptId,
          clientNow: event.payload.clientNow ? new Date(event.payload.clientNow as string) : undefined,
          visible: event.payload.visible as boolean,
          fullscreen: event.payload.fullscreen as boolean,
          online: event.payload.online as boolean,
          clientClockSkewMs: event.payload.clientClockSkewMs as number,
          remainingSeconds: event.payload.remainingSeconds as number,
          status: event.payload.status as string,
          warning: event.payload.warning as string,
          metadata: event.payload as any,
        },
      });
    } else if (["AttemptCreated", "AttemptStarted", "AttemptSubmitted"].includes(event.type)) {
      await this.prisma.attemptLifecycleEvent.create({
        data: {
          attemptId: event.attemptId,
          previousStatus: (event.payload.previousStatus || event.payload.oldStatus || null) as string | null,
          newStatus: (event.payload.newStatus || event.payload.status || "waiting") as string,
          reason: (event.payload.reason || "system") as string | null,
          actorType: "CANDIDATE",
          idempotencyKey: event.idempotencyKey,
          metadata: event.payload as any,
          occurredAt: occurredAtDate,
        },
      });
    } else if (event.type === "NavigationChanged") {
      await this.prisma.attemptNavigationEvent.create({
        data: {
          attemptId: event.attemptId,
          fromAttemptQuestionId: event.payload.fromQuestionId as string,
          toAttemptQuestionId: event.payload.toQuestionId as string,
          clientSequence: event.payload.clientSequence as number,
          idempotencyKey: event.idempotencyKey || `nav-${event.id}`,
          saveRequired: event.payload.saveRequired as boolean,
          saveSucceeded: event.payload.saveSucceeded as boolean,
          clientOccurredAt: event.payload.clientOccurredAt ? new Date(event.payload.clientOccurredAt as string) : undefined,
        },
      });
    } else if (event.type === "PayloadPreloaded") {
      const existing = await this.prisma.attemptPayloadReceipt.findFirst({
        where: {
          attemptId: event.attemptId,
          payloadHash: event.payload.payloadHash as string,
          receiptType: "PRELOAD",
        },
      });
      if (!existing) {
        await this.prisma.attemptPayloadReceipt.create({
          data: {
            attemptId: event.attemptId,
            payloadHash: event.payload.payloadHash as string,
            receiptType: "PRELOAD",
            clientInstanceId: event.payload.clientInstanceId as string,
          },
        });
      }
    } else if (event.type === "InstructionsAcknowledged") {
      const existing = await this.prisma.attemptInstructionAcknowledgement.findFirst({
        where: {
          attemptId: event.attemptId,
          instructionHash: event.payload.instructionHash as string,
        },
      });
      if (!existing) {
        await this.prisma.attemptInstructionAcknowledgement.create({
          data: {
            attemptId: event.attemptId,
            instructionHash: event.payload.instructionHash as string,
            policyVersion: event.payload.policyVersion as string,
            acceptedBy: event.payload.acceptedBy as string,
          },
        });
      }
    } else {
      // General lifecycle event fallback
      await this.prisma.attemptLifecycleEvent.create({
        data: {
          attemptId: event.attemptId,
          newStatus: event.payload.status as string || "UNKNOWN",
          actorType: "SYSTEM",
          idempotencyKey: event.idempotencyKey || `evt-${event.id}`,
          metadata: event.payload as any,
          occurredAt: occurredAtDate,
        },
      });
    }
  }

  async getAuditEvents(
    attemptId: string,
    type?: string
  ): Promise<AttemptAuditEvent[]> {
    const results: AttemptAuditEvent[] = [];

    // 1. Fetch lifecycle events
    const lifecycles = await this.prisma.attemptLifecycleEvent.findMany({
      where: { attemptId },
      orderBy: { occurredAt: "asc" },
    });
    results.push(
      ...lifecycles.map((l) => ({
        id: l.id,
        attemptId: l.attemptId,
        type: l.newStatus === "IN_PROGRESS" ? "AttemptStarted" : (l.newStatus === "SUBMITTED" ? "AttemptSubmitted" : "AttemptLifecycle"),
        idempotencyKey: l.idempotencyKey || undefined,
        payload: (l.metadata as any) || {},
        occurredAt: l.occurredAt.toISOString(),
      }))
    );

    // 2. Fetch heartbeats
    const heartbeats = await this.prisma.attemptHeartbeatEvent.findMany({
      where: { attemptId },
      orderBy: { serverReceivedAt: "asc" },
    });
    results.push(
      ...heartbeats.map((h) => ({
        id: h.id,
        attemptId: h.attemptId,
        type: "HeartbeatReceived",
        payload: (h.metadata as any) || {},
        occurredAt: h.serverReceivedAt.toISOString(),
      }))
    );

    // Filter by type if provided
    return type ? results.filter((event) => event.type === type) : results;
  }

  async hasIdempotencyKey(
    attemptId: string,
    idempotencyKey: string
  ): Promise<boolean> {
    const lifecycleCount = await this.prisma.attemptLifecycleEvent.count({
      where: { attemptId, idempotencyKey },
    });
    if (lifecycleCount > 0) return true;

    const navCount = await this.prisma.attemptNavigationEvent.count({
      where: { attemptId, idempotencyKey },
    });
    if (navCount > 0) return true;

    const responseCount = await this.prisma.questionResponseEvent.count({
      where: { attemptId, idempotencyKey },
    });
    if (responseCount > 0) return true;

    return false;
  }

  // --- Seeding fallback matching mock state store exactly ---
  private getMockSession(): AssessmentRuntimeSession {
    const attemptId = "mock-attempt-001";
    const now = new Date();
    const startsAt = new Date(now.getTime() - 5 * 60 * 1000);
    const endsAt = new Date(startsAt.getTime() + 45 * 60 * 1000);

    return {
      attemptId,
      quizId: "quiz-civil-service-2026",
      assessmentTitle: "Төрийн албан хаагчийн ерөнхий мэдлэгийн үнэлгээ",
      userId: "candidate-001",
      userDisplayName: "Бат-Эрдэнэ Б.",
      serverNow: now.toISOString(),
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      durationSeconds: 45 * 60,
      status: "active",
      autosaveIntervalSeconds: 5,
      heartbeatIntervalSeconds: 5,
      scheduledStartsAt: startsAt.toISOString(),
      scheduledEndsAt: endsAt.toISOString(),
      waitingRoomOpensAt: new Date(startsAt.getTime() - 15 * 60 * 1000).toISOString(),
      requiredEarlyJoinMinutes: 15,
      questionCount: 60,
      totalPoints: 100,
      passingPercent: 70,
      encryptedPayload: {
        payloadId: "payload-mock-attempt-001",
        quizId: "quiz-civil-service-2026",
        attemptId,
        algorithm: "AES-GCM",
        keyDelivery: "start_unlock_event",
        encryptedContent: "mock.encrypted.payload",
        iv: "mock-iv",
        checksum: "sha256:mock-checksum",
        createdAt: now.toISOString(),
      },
      manifest: [
        {
          id: "q1",
          code: "Q1",
          type: "single_choice",
          sectionId: "sec-general",
          sectionName: "Ерөнхий мэдлэг",
          order: 1,
          points: 2,
          required: true,
        },
        {
          id: "q2",
          code: "Q2",
          type: "multiple_choice",
          sectionId: "sec-general",
          sectionName: "Ерөнхий мэдлэг",
          order: 2,
          points: 3,
          required: true,
        },
        {
          id: "q3",
          code: "Q3",
          type: "essay",
          sectionId: "sec-application",
          sectionName: "Хэрэглээ",
          order: 3,
          points: 10,
          required: true,
        },
      ],
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
  }

  private getMockSnapshot(): AssessmentAnswerSnapshot {
    return {
      attemptId: "mock-attempt-001",
      answers: {},
      markedForReview: {},
      localVersion: 0,
      serverVersion: 0,
      pendingSubmit: false,
    };
  }

  private getMockQuestions(): any[] {
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
}
