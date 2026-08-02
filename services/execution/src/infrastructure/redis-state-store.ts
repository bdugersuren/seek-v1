import { Injectable, Inject } from "@nestjs/common";
import {
  AssessmentRuntimeSession,
  AssessmentAnswerSnapshot,
} from "@seek/contracts";
import Redis from "ioredis";
import {
  AttemptAuditEvent,
  AttemptStateStore,
} from "../interfaces/state-store.interface";

@Injectable()
export class RedisAttemptStateStore implements AttemptStateStore {
  constructor(
    @Inject("REDIS_CLIENT")
    private readonly redis: Redis | null
  ) {}

  private getRedis(): Redis {
    if (!this.redis) {
      throw new Error(
        "RedisAttemptStateStore requires USE_REDIS=true and an initialized Redis client"
      );
    }

    return this.redis;
  }

  private getSessionKey(attemptId: string): string {
    return `attempt:${attemptId}:session`;
  }

  private getAnswersKey(attemptId: string): string {
    return `attempt:${attemptId}:answers`;
  }

  private getQuestionsKey(attemptId: string): string {
    return `attempt:${attemptId}:questions`;
  }

  private getViolationKey(attemptId: string, type: string): string {
    return `attempt:${attemptId}:violation:${type}`;
  }

  private getAuditKey(attemptId: string): string {
    return `attempt:${attemptId}:audit`;
  }

  private getIdempotencyKey(attemptId: string): string {
    return `attempt:${attemptId}:idempotency`;
  }

  private calculateTTL(endsAt: string): number {
    const remaining = Math.floor((new Date(endsAt).getTime() - Date.now()) / 1000);
    // Keep in cache for remaining duration + 1 hour buffer (minimum 3600s)
    return Math.max(3600, remaining + 3600);
  }

  async getSession(attemptId: string): Promise<AssessmentRuntimeSession | null> {
    const redis = this.getRedis();
    const data = await redis.get(this.getSessionKey(attemptId));
    if (!data) {
      // Seed mock data if not exists for local testing
      if (attemptId === "mock-attempt-001") {
        const mockSession = this.getMockSession();
        await this.saveSession(mockSession);
        return mockSession;
      }
      return null;
    }
    const session = JSON.parse(data) as AssessmentRuntimeSession;
    return {
      ...session,
      serverNow: new Date().toISOString(),
    };
  }

  async saveSession(session: AssessmentRuntimeSession): Promise<void> {
    const ttl = this.calculateTTL(session.endsAt);
    await this.getRedis().set(
      this.getSessionKey(session.attemptId),
      JSON.stringify(session),
      "EX",
      ttl
    );
  }

  async getAnswers(attemptId: string): Promise<AssessmentAnswerSnapshot | null> {
    const redis = this.getRedis();
    const data = await redis.get(this.getAnswersKey(attemptId));
    if (!data) {
      if (attemptId === "mock-attempt-001") {
        const mockSnapshot = this.getMockSnapshot();
        await this.saveAnswers(attemptId, mockSnapshot);
        return mockSnapshot;
      }
      return null;
    }
    return JSON.parse(data) as AssessmentAnswerSnapshot;
  }

  async saveAnswers(
    attemptId: string,
    snapshot: AssessmentAnswerSnapshot
  ): Promise<void> {
    const session = await this.getSession(attemptId);
    const ttl = session ? this.calculateTTL(session.endsAt) : 3600;
    await this.getRedis().set(
      this.getAnswersKey(attemptId),
      JSON.stringify(snapshot),
      "EX",
      ttl
    );
  }

  async saveQuestions(attemptId: string, questions: any[]): Promise<void> {
    const session = await this.getSession(attemptId);
    const ttl = session ? this.calculateTTL(session.endsAt) : 3600;
    await this.getRedis().set(
      this.getQuestionsKey(attemptId),
      JSON.stringify(questions),
      "EX",
      ttl
    );
  }

  async incrementViolation(attemptId: string, type: string): Promise<number> {
    const key = this.getViolationKey(attemptId, type);
    const redis = this.getRedis();
    const count = await redis.incr(key);
    
    const session = await this.getSession(attemptId);
    const ttl = session ? this.calculateTTL(session.endsAt) : 3600;
    await redis.expire(key, ttl);
    
    return count;
  }

  async getViolationCount(attemptId: string, type: string): Promise<number> {
    const val = await this.getRedis().get(this.getViolationKey(attemptId, type));
    return val ? parseInt(val, 10) : 0;
  }

  async getQuestions(attemptId: string): Promise<any[] | null> {
    const redis = this.getRedis();
    const data = await redis.get(this.getQuestionsKey(attemptId));
    if (!data) {
      if (attemptId === "mock-attempt-001") {
        const mockQuestions = this.getMockQuestions();
        const session = await this.getSession(attemptId);
        const ttl = session ? this.calculateTTL(session.endsAt) : 3600;
        await redis.set(
          this.getQuestionsKey(attemptId),
          JSON.stringify(mockQuestions),
          "EX",
          ttl
        );
        return mockQuestions;
      }
      return null;
    }
    return JSON.parse(data);
  }

  async appendAuditEvent(event: AttemptAuditEvent): Promise<void> {
    const session = await this.getSession(event.attemptId);
    const ttl = session ? this.calculateTTL(session.endsAt) : 3600;
    const redis = this.getRedis();

    await redis.rpush(this.getAuditKey(event.attemptId), JSON.stringify(event));
    await redis.expire(this.getAuditKey(event.attemptId), ttl);

    if (event.idempotencyKey) {
      await redis.sadd(this.getIdempotencyKey(event.attemptId), event.idempotencyKey);
      await redis.expire(this.getIdempotencyKey(event.attemptId), ttl);
    }
  }

  async getAuditEvents(
    attemptId: string,
    type?: string
  ): Promise<AttemptAuditEvent[]> {
    const rows = await this.getRedis().lrange(this.getAuditKey(attemptId), 0, -1);
    const events = rows.map((row) => JSON.parse(row) as AttemptAuditEvent);
    return type ? events.filter((event) => event.type === type) : events;
  }

  async hasIdempotencyKey(
    attemptId: string,
    idempotencyKey: string
  ): Promise<boolean> {
    const exists = await this.getRedis().sismember(
      this.getIdempotencyKey(attemptId),
      idempotencyKey
    );
    return exists === 1;
  }

  // --- Mock Data Generators for Local Dev Seeding ---
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
