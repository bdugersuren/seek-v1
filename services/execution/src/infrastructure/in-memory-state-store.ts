import { Injectable } from "@nestjs/common";
import {
  AssessmentRuntimeSession,
  AssessmentAnswerSnapshot,
} from "@seek/contracts";
import { AttemptStateStore } from "../interfaces/state-store.interface";

@Injectable()
export class InMemoryAttemptStateStore implements AttemptStateStore {
  private readonly sessions = new Map<string, AssessmentRuntimeSession>();
  private readonly snapshots = new Map<string, AssessmentAnswerSnapshot>();
  private readonly violations = new Map<string, Map<string, number>>();
  private readonly questions = new Map<string, any[]>();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    const attemptId = "mock-attempt-001";
    const now = new Date();
    const startsAt = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutes ago
    const endsAt = new Date(startsAt.getTime() + 45 * 60 * 1000); // 45 minutes duration

    const mockSession: AssessmentRuntimeSession = {
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

    const mockSnapshot: AssessmentAnswerSnapshot = {
      attemptId,
      answers: {},
      markedForReview: {},
      localVersion: 0,
      serverVersion: 0,
      pendingSubmit: false,
    };

    const mockQuestions = [
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

    this.sessions.set(attemptId, mockSession);
    this.snapshots.set(attemptId, mockSnapshot);
    this.questions.set(attemptId, mockQuestions);
    this.violations.set(attemptId, new Map<string, number>());
  }

  async getSession(attemptId: string): Promise<AssessmentRuntimeSession | null> {
    const session = this.sessions.get(attemptId);
    if (!session) return null;
    // Update serverNow dynamic timestamp
    return {
      ...session,
      serverNow: new Date().toISOString(),
    };
  }

  async saveSession(session: AssessmentRuntimeSession): Promise<void> {
    this.sessions.set(session.attemptId, session);
  }

  async getAnswers(attemptId: string): Promise<AssessmentAnswerSnapshot | null> {
    return this.snapshots.get(attemptId) || null;
  }

  async saveAnswers(attemptId: string, snapshot: AssessmentAnswerSnapshot): Promise<void> {
    this.snapshots.set(attemptId, snapshot);
  }

  async incrementViolation(attemptId: string, type: string): Promise<number> {
    if (!this.violations.has(attemptId)) {
      this.violations.set(attemptId, new Map<string, number>());
    }
    const attemptViolations = this.violations.get(attemptId)!;
    const currentCount = attemptViolations.get(type) || 0;
    const newCount = currentCount + 1;
    attemptViolations.set(type, newCount);
    return newCount;
  }

  async getViolationCount(attemptId: string, type: string): Promise<number> {
    const attemptViolations = this.violations.get(attemptId);
    if (!attemptViolations) return 0;
    return attemptViolations.get(type) || 0;
  }

  async getQuestions(attemptId: string): Promise<any[] | null> {
    return this.questions.get(attemptId) || null;
  }
}
