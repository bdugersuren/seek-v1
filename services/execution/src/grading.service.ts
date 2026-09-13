import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { CryptoKMSService } from "./infrastructure/crypto-kms.service";

export function autoScore(
  config: any,
  answer: unknown,
  max: number,
): number | null {
  if (
    answer === undefined ||
    answer === null ||
    answer === "" ||
    (Array.isArray(answer) && !answer.length)
  )
    return 0;
  const options = config.options || [],
    scoring = config.scoringConfig || {};
  const sourceMax = Number(config.defaultMaxScore || max);
  const finish = (score: number) =>
    Math.round(
      Math.min(
        max,
        Math.max(
          (Number(config.defaultMinScore || 0) * max) / sourceMax,
          (score * max) / sourceMax,
        ),
      ) * 10000,
    ) / 10000;
  const selected = (Array.isArray(answer) ? answer : [answer]).map(String);
  const equal = (a: string[], b: string[]) =>
    a.length === b.length &&
    JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
  if (
    ["SINGLE_CHOICE", "TRUE_FALSE", "MULTIPLE_CHOICE"].includes(config.type)
  ) {
    if (
      new Set(selected).size !== selected.length ||
      selected.some((id) => !options.some((o: any) => o.id === id))
    )
      return 0;
    if (config.type !== "MULTIPLE_CHOICE" && selected.length !== 1) return 0;
    // Old attempt snapshots did not carry scoringConfig; preserve their grading policy.
    if (!config.scoringConfig) {
      const correct = options
        .filter((o: any) => o.isCorrect)
        .map((o: any) => o.id);
      return correct.length && equal(correct, selected) ? max : 0;
    }
    if (scoring.scoringMode === "combination") {
      const combo = (scoring.combinations || []).find((c: any) =>
        equal(c.ids || c.selected || [], selected),
      );
      return finish(Number(combo?.score || 0));
    }
    return finish(
      options
        .filter((o: any) => selected.includes(o.id))
        .reduce((n: number, o: any) => n + Number(o.score || 0), 0),
    );
  }
  if (config.type === "MATCHING" || config.type === "MATRIX") {
    if (typeof answer !== "object" || Array.isArray(answer)) return 0;
    const pairs = answer as Record<string, string>;
    if (Object.keys(pairs).some((id) => !options.some((o: any) => o.id === id)))
      return 0;
    if (scoring.scoringMode === "combination") {
      const ids = Object.entries(pairs).map(
        ([left, right]) => `${left}:${right}`,
      );
      const combo = (scoring.combinations || []).find((c: any) =>
        equal(c.ids || [], ids),
      );
      return finish(Number(combo?.score || 0));
    }
    return finish(
      options.reduce(
        (n: number, o: any) =>
          n +
          (pairs[o.id] && pairs[o.id] === o.matchRules?.matchValue
            ? Number(o.score || 0)
            : 0),
        0,
      ),
    );
  }
  if (config.type === "NUMERIC") {
    const expected =
      config.answerConfig?.targetValue ??
      options[0]?.value ??
      config.answerConfig?.answerKey;
    if (expected === undefined || !Number.isFinite(Number(expected)))
      return null;
    const tolerance = Number(
      config.answerConfig?.tolerance ?? options[0]?.matchRules?.matchValue ?? 0,
    );
    return Number.isFinite(Number(answer)) &&
      Math.abs(Number(answer) - Number(expected)) <= tolerance
      ? max
      : 0;
  }
  return null;
}
@Injectable()
export class GradingService {
  constructor(
    private readonly db: PrismaService,
    private readonly kms: CryptoKMSService,
  ) {}
  async grade(attemptId: string) {
    await this.db.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM quiz_attempt WHERE id=${attemptId} FOR UPDATE`;
      const a = await tx.quizAttempt.findUnique({
        where: { id: attemptId },
        include: {
          questions: { orderBy: { orderIndex: "asc" } },
          snapshot: true,
        },
      });
      if (!a || a.status !== "SUBMITTED")
        throw new ConflictException("Submission is not ready");
      const policy = a.runtimePolicySnapshot as any;
      if (policy.result) return;
      const answers = (a.snapshot?.answers || {}) as Record<string, unknown>;
      const grades = a.questions.map((q) => {
        const sealed = JSON.parse(q.gradingConfigCipher!.toString());
        const config = JSON.parse(
          this.kms.decrypt(sealed.encryptedData, sealed.iv, sealed.authTag),
        );
        return {
          questionId: q.questionId,
          maxScore: Number(q.maxScoreSnapshot),
          score: autoScore(
            config,
            answers[q.questionId],
            Number(q.maxScoreSnapshot),
          ),
          comment: "",
        };
      });
      const result = {
        status: grades.some((g) => g.score === null)
          ? "REVIEW_REQUIRED"
          : "GRADED",
        grades,
        totalScore: grades.reduce((sum, g) => sum + (g.score || 0), 0),
        maxScore: grades.reduce((sum, g) => sum + g.maxScore, 0),
        gradedAt: new Date().toISOString(),
        publishedAt: null,
      };
      await tx.quizAttempt.update({
        where: { id: attemptId },
        data: { runtimePolicySnapshot: { ...policy, result } },
      });
    });
  }
  async read(attemptId: string, admin = false) {
    const a = await this.db.quizAttempt.findUnique({
      where: { id: attemptId },
      include: admin
        ? { questions: { orderBy: { orderIndex: "asc" } }, snapshot: true }
        : undefined,
    });
    if (!a) throw new NotFoundException();
    const result = (a.runtimePolicySnapshot as any).result;
    const schedule = a.scheduleSnapshot as any;
    if (admin)
      return {
        attemptId,
        candidateId: a.candidateId,
        title: schedule.title,
        result: result || { status: "PENDING" },
        questions: (a as any).questions?.map((q: any) => ({
          questionId: q.questionId,
          content: q.contentSnapshot,
          maxScore: Number(q.maxScoreSnapshot),
          answer: ((a as any).snapshot?.answers || {})[q.questionId],
          rubric: q.gradingConfigCipher
            ? (() => {
                const x = JSON.parse(q.gradingConfigCipher.toString());
                return JSON.parse(
                  this.kms.decrypt(x.encryptedData, x.iv, x.authTag),
                ).rubric;
              })()
            : null,
        })),
      };
    if (!result) return { status: "PENDING" };
    const released =
      result.publishedAt ||
      (result.status === "GRADED" &&
        schedule.resultReleaseAt &&
        new Date(schedule.resultReleaseAt) <= new Date());
    if (!released)
      return {
        status:
          result.status === "REVIEW_REQUIRED"
            ? "REVIEW_REQUIRED"
            : "AWAITING_RELEASE",
        releaseAt: schedule.resultReleaseAt || null,
      };
    return {
      status: "PUBLISHED",
      title: schedule.title,
      totalScore: result.totalScore,
      maxScore: result.maxScore,
      percentage: result.maxScore
        ? (result.totalScore / result.maxScore) * 100
        : 0,
      publishedAt: result.publishedAt || schedule.resultReleaseAt,
    };
  }
  async review(
    attemptId: string,
    actor: string,
    body: {
      scores?: Array<{ questionId: string; score: number; comment?: string }>;
      publish?: boolean;
      expectedRevision: number;
    },
  ) {
    return this.db.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM quiz_attempt WHERE id=${attemptId} FOR UPDATE`;
      const a = await tx.quizAttempt.findUnique({ where: { id: attemptId } });
      if (!a) throw new NotFoundException();
      if (a.candidateId === actor)
        throw new ForbiddenException("Өөрийн шалгалтын дүнг батлах боломжгүй.");
      if (a.rowVersion !== body.expectedRevision)
        throw new ConflictException("Мэдээлэл өөрчлөгдсөн. Дахин ачаална уу.");
      const policy = a.runtimePolicySnapshot as any;
      const result = policy.result;
      if (!result) throw new ConflictException("Дүн тооцоолж байна.");
      if (
        result.publishedAt ||
        (result.status === "GRADED" &&
          (a.scheduleSnapshot as any).resultReleaseAt &&
          new Date((a.scheduleSnapshot as any).resultReleaseAt) <= new Date())
      )
        throw new ConflictException("Нийтэлсэн дүнг өөрчлөх боломжгүй.");
      for (const input of body.scores || []) {
        const g = result.grades.find(
          (x: any) => x.questionId === input.questionId,
        );
        if (
          !g ||
          !Number.isFinite(input.score) ||
          input.score < 0 ||
          input.score > g.maxScore
        )
          throw new BadRequestException("Оноо зөв хязгаарт байх ёстой.");
        g.score = input.score;
        g.comment = String(input.comment || "").slice(0, 4000);
      }
      result.totalScore = result.grades.reduce(
        (sum: number, g: any) => sum + (g.score || 0),
        0,
      );
      result.status = result.grades.some((g: any) => g.score === null)
        ? "REVIEW_REQUIRED"
        : "GRADED";
      if (body.publish) {
        if (result.status !== "GRADED")
          throw new ConflictException("Бүх асуултыг үнэлнэ үү.");
        result.publishedAt = new Date().toISOString();
        result.publishedBy = actor;
      }
      await tx.quizAttempt.update({
        where: { id: attemptId },
        data: {
          runtimePolicySnapshot: { ...policy, result },
          rowVersion: { increment: 1 },
        },
      });
      await tx.attemptLifecycleEvent.create({
        data: {
          attemptId,
          actorType: "ADMIN",
          newStatus: body.publish ? "RESULT_PUBLISHED" : "RESULT_GRADED",
          metadata: { actor, result },
          idempotencyKey: `review:${attemptId}:${body.expectedRevision}`,
        },
      });
      return { success: true };
    });
  }
  async queue() {
    return this.db.quizAttempt.findMany({
      where: { status: "SUBMITTED" },
      select: {
        id: true,
        candidateId: true,
        rowVersion: true,
        scheduleSnapshot: true,
        runtimePolicySnapshot: true,
        submittedAt: true,
      },
      orderBy: { submittedAt: "desc" },
      take: 100,
    });
  }
}
