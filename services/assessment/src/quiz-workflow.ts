import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from "@nestjs/common";
import { createHash } from "crypto";
import { Actor } from "./question-workflow";
import { RUNTIME_TYPES } from "./blueprint-pools";
export function quizActions(q: any, r: any, actor: Actor) {
  if (!r || ["ARCHIVED", "SUSPENDED"].includes(q.lifecycleStatus)) return [];
  const own = q.createdBy === actor.id,
    latest = q.revisions?.[0]?.id === r.id,
    out: string[] = [];
  if (own && latest) {
    if (r.revisionStatus === "DRAFT")
      out.push("save", "reselect", "approval_requested");
    if (r.revisionStatus === "IN_REVIEW") out.push("withdraw");
    if (r.revisionStatus === "REJECTED") out.push("reopen");
  }
  if (
    own &&
    ["PUBLISHED", "RETIRED"].includes(r.revisionStatus) &&
    !q.revisions.some((x: any) =>
      ["DRAFT", "IN_REVIEW", "APPROVED"].includes(x.revisionStatus),
    )
  )
    out.push("new_revision");
  if (latest && !own && actor.roles.includes("SUPER_ADMIN")) {
    if (r.revisionStatus === "IN_REVIEW")
      out.push("approve", "changes_requested");
    if (r.revisionStatus === "APPROVED")
      out.push("publish", "changes_requested");
  }
  return out;
}
export function quizSettings(dto: any) {
  if(!dto || typeof dto!=="object" || Array.isArray(dto)) throw new BadRequestException("Тохиргооны формат буруу.");
  const fail = (field: string, message: string) => {
    throw new BadRequestException({ field, message });
  };
  if (
    dto.title !== undefined &&
    (typeof dto.title !== "string" ||
      !dto.title.trim() ||
      dto.title.length > 300)
  )
    fail("title", "Нэрээ 1–300 тэмдэгтээр оруулна уу.");
  if (
    dto.description !== undefined &&
    (typeof dto.description !== "string" || dto.description.length > 20000)
  )
    fail("description", "Тайлбар 20000 тэмдэгтээс хэтрэхгүй.");
  for (const [field, min, max] of [
    ["durationMinutes", 1, 1440],
    ["maxAttempts", 1, 1000],
  ] as const)
    if (
      dto[field] !== undefined &&
      (!Number.isInteger(dto[field]) || dto[field] < min || dto[field] > max)
    )
      fail(field, `${min}–${max} хооронд бүхэл тоо оруулна уу.`);
  if (
    dto.passingScore !== undefined &&
    (!Number.isFinite(dto.passingScore) ||
      dto.passingScore < 0 ||
      dto.passingScore > 100)
  )
    fail("passingScore", "Тэнцэх босго 0–100% байна.");
  if (
    dto.reselectQuestions !== undefined &&
    typeof dto.reselectQuestions !== "boolean"
  )
    fail("reselectQuestions", "Дахин сонголтын формат буруу.");
  if (
    dto.questionOverrides !== undefined &&
    (!Array.isArray(dto.questionOverrides) ||
      dto.questionOverrides.length > 500 ||
      dto.questionOverrides.some(
        (o: any) =>
          !o ||
          typeof o.questionId !== "string" ||
          !["mandatory", "excluded"].includes(o.mode),
      ))
  )
    fail("questionOverrides", "Override формат буруу.");
}
export function snapshotReadiness(q: any, r: any) {
  const issues: string[] = [];
  if (!r)
    return { status: "NEEDS_ATTENTION", issues: ["Quiz хувилбар олдсонгүй."] };
  try {
    quizSettings({
      title: r.title,
      durationMinutes: r.durationMinutes,
      maxAttempts: r.maxAttempts,
      passingScore: Number(r.passingScore),
    });
  } catch (e: any) {
    issues.push(e.response?.message || e.message);
  }
  if (["ARCHIVED", "SUSPENDED"].includes(q.lifecycleStatus))
    issues.push("Quiz архивлагдсан.");
  const rows = r.sections.flatMap((s: any) => s.questions),
    ids = rows.map((x: any) => x.questionId);
  if (!rows.length) issues.push("Асуултгүй Quiz нийтлэхгүй.");
  if (new Set(ids).size !== ids.length) issues.push("Асуулт давхардсан.");
  let points = 0;
  for (const s of r.sections) {
    if (s.questions.length !== s.questionCount)
      issues.push(`${s.title}: авах тоо зөрсөн.`);
    for (const x of s.questions) {
      points += Number(x.maxScore);
      if (
        !Number.isFinite(Number(x.maxScore)) ||
        Number(x.maxScore) <= 0 ||
        Number(x.maxScore) !== Number(s.maxScorePerQuestion)
      )
        issues.push(`${s.title}: оноо зөрсөн.`);
      if (
        !x.questionVersion ||
        x.questionVersion.versionStatus !== "PUBLISHED" ||
        x.question.deletedAt ||
        x.question.lifecycleStatus !== "ACTIVE" ||
        x.question.ownerUserId !== q.createdBy
      )
        issues.push("Асуултын тогтоосон хувилбар хүчингүй болсон.");
      if (!RUNTIME_TYPES.includes(x.questionVersion?.type))
        issues.push("Runtime дэмждэггүй асуултын төрөл.");
    }
  }
  if (
    rows.length !== r.totalQuestionCount ||
    Math.abs(points - Number(r.totalMaxScore)) > 0.0001
  )
    issues.push("Нийт тоо/оноо зөрсөн.");
  return {
    status: issues.length ? "NEEDS_ATTENTION" : "READY",
    issues: [...new Set(issues)],
    questionCount: rows.length,
    totalPoints: points,
  };
}
export function assertQuizVersion(q: any, dto: any) {
  if (
    !Number.isInteger(dto?.expectedVersion) ||
    q.version !== dto?.expectedVersion
  )
    throw new ConflictException(
      "Өөр цонх Quiz-ийг шинэчилсэн. Өөрчлөлтөө хадгалж аваад дахин ачаална уу.",
    );
}
export function requireQuizAction(
  q: any,
  r: any,
  actor: Actor,
  action: string,
) {
  if (!quizActions(q, r, actor).includes(action))
    throw new ForbiddenException("Энэ хувилбарт уг үйлдлийг хийх эрхгүй.");
}
function canonical(value: any): any {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .filter((k) => value[k] !== undefined)
        .map((k) => [k, canonical(value[k])]),
    );
  return value;
}
export function quizHash(value: any) {
  return createHash("sha256")
    .update(JSON.stringify(canonical(value)))
    .digest("hex");
}
export async function quizRequest(
  tx: any,
  actor: Actor,
  operation: string,
  dto: any,
  fn: () => Promise<string>,
) {
  if (
    typeof dto?.requestId !== "string" ||
    dto.requestId.length < 8 ||
    dto.requestId.length > 128
  )
    throw new BadRequestException("requestId шаардлагатай.");
  const key = actor.id + ":" + dto.requestId,
    fingerprint = quizHash({ operation, dto });
  await tx.$queryRaw`SELECT 1 FROM pg_advisory_xact_lock(hashtext(${key}))`;
  const old = await tx.quizMutationRequest.findUnique({ where: { key } });
  if (old) {
    if (old.fingerprint !== fingerprint)
      throw new ConflictException("Ижил requestId өөр хүсэлтэд ашиглагдсан.");
    return old.quizId;
  }
  const quizId = await fn();
  await tx.quizMutationRequest.create({ data: { key, fingerprint, quizId } });
  return quizId;
}
