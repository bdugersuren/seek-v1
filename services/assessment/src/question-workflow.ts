import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "./prisma.service";

export type Actor = { id: string; roles: string[] };
export function actorFrom(req: any): Actor {
  return {
    id: String(req.headers["x-user-id"] || ""),
    roles: String(req.headers["x-user-roles"] || "").split(","),
  };
}
export function actionsFor(q: any, actor: Actor): string[] {
  const status = (q.activeVersion || q.versions?.[0])?.versionStatus;
  const own = q.ownerUserId === actor.id;
  const result: string[] = [];
  if (own) {
    if (status === "DRAFT") result.push("approval_requested");
    if (status === "CHANGES_REQUESTED") result.push("resubmitted");
    if (status === "IN_REVIEW") result.push("withdraw");
  }
  if (actor.roles.includes("SUPER_ADMIN") && !own) {
    if (status === "IN_REVIEW")
      result.push("approve", "changes_requested", "reject");
    if (status === "APPROVED") result.push("publish");
    if (status === "PUBLISHED") result.push("retire");
  }
  return result;
}
export function decorateQuestion(q: any, actor: Actor) {
  return { ...q, allowedActions: actionsFor(q, actor) };
}
export async function lockQuestion(tx: any, id: string) {
  await tx.$queryRaw`SELECT id FROM question WHERE id = ${id} FOR UPDATE`;
}

export function validateContent(v: any) {
  const fail = (message: string) => {
    throw new BadRequestException(message);
  };
  if (!v.title?.trim() || !v.body?.replace(/<[^>]*>/g, "").trim())
    fail("Асуултын гарчиг болон агуулгыг бөглөнө үү.");
  if (
    !Number.isFinite(Number(v.defaultMinScore)) ||
    !Number.isFinite(Number(v.defaultMaxScore)) ||
    Number(v.defaultMaxScore) <= 0 ||
    Number(v.defaultMinScore) > Number(v.defaultMaxScore)
  )
    fail("Онооны тохиргоо буруу байна.");
  const opts = v.options || [],
    nonempty = (o: any) => typeof o.value === "string" && o.value.trim();
  if (["SINGLE_CHOICE", "MULTIPLE_CHOICE", "TRUE_FALSE"].includes(v.type)) {
    if (opts.length < 2 || opts.some((o: any) => !nonempty(o)))
      fail("Хариултын сонголтуудаа бүрэн бөглөнө үү.");
    const correct = opts.filter((o: any) => o.isCorrect).length;
    const config = v.scoringConfig || {};
    if (config.scoringMode === "combination" && v.type === "MULTIPLE_CHOICE") {
      const keys = opts.map((o: any) => o.optionKey || o.id);
      if (
        !Array.isArray(config.combinations) ||
        !config.combinations.length ||
        config.combinations.some(
          (c: any) =>
            !Array.isArray(c.ids) ||
            !c.ids.length ||
            new Set(c.ids).size !== c.ids.length ||
            c.ids.some((id: any) => !keys.includes(id)) ||
            !Number.isFinite(Number(c.score)),
        )
      )
        fail("Сонголтын хослол ба оноог бүрэн тохируулна уу.");
    } else if (!correct || (v.type !== "MULTIPLE_CHOICE" && correct !== 1))
      fail("Зөв хариултын тохиргоо буруу байна.");
  } else if (["ESSAY", "CASE_BUNDLE"].includes(v.type)) {
    if (
      !Array.isArray(v.rubric) ||
      !v.rubric.length ||
      v.rubric.some(
        (r: any) =>
          !Number.isFinite(Number(r.maxScore)) || Number(r.maxScore) <= 0,
      )
    )
      fail("Үнэлгээний rubric болон оноо шаардлагатай.");
  } else if (v.type === "SHORT_TEXT") {
    const rubric =
      Array.isArray(v.rubric) &&
      v.rubric.length &&
      v.rubric.every((r: any) => Number(r.maxScore) > 0);
    const answer = String(v.answerConfig?.answerKey || "").trim();
    if (!rubric && (!answer || answer === "-"))
      fail("Зөв хариулт эсвэл rubric оруулна уу.");
  } else if (v.type === "NUMERIC") {
    const target = v.answerConfig?.targetValue ?? opts[0]?.value;
    if (
      target === undefined ||
      String(target).trim() === "" ||
      !Number.isFinite(Number(target))
    )
      fail("Тоон зөв хариултыг оруулна уу.");
  } else if (v.type === "FILL_BLANK") {
    if (
      !opts.length ||
      opts.some(
        (o: any) =>
          !o.metadata?.acceptedValues?.length ||
          o.metadata.acceptedValues.some(
            (x: any) =>
              !String(x.value || "").trim() ||
              !Number.isFinite(Number(x.score)),
          ),
      )
    )
      fail("Нөхөх талбар бүрийн зөв хариулт, оноог оруулна уу.");
  } else if (v.type === "MATCHING") {
    const config = v.scoringConfig || v.payload?.scoringConfig || {};
    const rights = config.rightOptions || [];
    if (opts.length < 2 || opts.some((o: any) => !nonempty(o)))
      fail("Зүүн талын дор хаяж хоёр мөрийг бөглөнө үү.");
    if (
      rights.length < 2 ||
      rights.some((r: any) => !r.id || !String(r.value || "").trim()) ||
      new Set(rights.map((r: any) => r.id)).size !== rights.length
    )
      fail("Баруун талын хариултууд хоосон эсвэл давхардсан ID-тай байна.");
    const keys = opts.map((o: any) => o.optionKey || o.id);
    const rightKeys = new Set(rights.map((r: any) => r.id));
    if (new Set(keys).size !== keys.length)
      fail("Зүүн талын мөрийн ID давхардсан байна.");
    if (config.scoringMode === "combination") {
      const combos = config.combinations;
      if (!Array.isArray(combos) || !combos.length)
        fail("Харгалзуулах хослолын оноог тохируулна уу.");
      for (const c of combos) {
        const pairs = Array.isArray(c.ids) ? c.ids : [];
        const parsed = pairs.map((x: any) =>
          typeof x === "string" ? x.split(":") : [],
        );
        if (
          !Number.isFinite(Number(c.score)) ||
          pairs.length !== keys.length ||
          new Set(parsed.map((x: any) => x[0])).size !== keys.length ||
          parsed.some(
            (x: any) =>
              x.length !== 2 || !keys.includes(x[0]) || !rightKeys.has(x[1]),
          )
        )
          fail("Хослолд зүүн мөр бүрийн хүчинтэй харгалзааг сонгоно уу.");
      }
    } else if (opts.some((o: any) => !rightKeys.has(o.matchRules?.matchValue)))
      fail("Зүүн мөр бүрийн харгалзах хариултыг сонгоно уу.");
  } else if (v.type === "MATRIX") {
    const config = v.scoringConfig || v.payload?.scoringConfig || {};
    const columns = config.matrixColumns;
    if (config.scoringMode === "combination")
      fail("Матрицын хослолын оноолт дэмжигдэхгүй. Харгалзах оноо сонгоно уу.");
    if (
      !Array.isArray(columns) ||
      columns.length < 2 ||
      columns.some((c: any) => !c.id || !String(c.label || "").trim()) ||
      new Set(columns.map((c: any) => c.id)).size !== columns.length
    )
      fail("Матрицын ялгаатай ID, нэртэй дор хаяж хоёр багана шаардлагатай.");
    if (
      !opts.length ||
      opts.some(
        (o: any) =>
          !nonempty(o) ||
          !columns.some((c: any) => c.id === o.matchRules?.matchValue),
      )
    )
      fail("Матрицын мөр бүрийн өгүүлбэр болон зөв баганыг сонгоно уу.");
  } else {
    if (
      opts.length < (v.type === "MATRIX" ? 1 : 2) ||
      opts.some((o: any) => !nonempty(o))
    )
      fail("Асуултын төрөлд тохирсон хариултуудыг бөглөнө үү.");
  }
  if (opts.some((o: any) => !Number.isFinite(Number(o.score))))
    fail("Хариултын оноо буруу байна.");
  if (
    v.defaultTimeSeconds !== null &&
    (!Number.isInteger(v.defaultTimeSeconds) || v.defaultTimeSeconds <= 0)
  )
    fail("Хугацаа эерэг бүхэл тоо байна.");
  if ((v.media || []).some((m: any) => !m.storageKey))
    fail("Файлын холбоос дутуу байна.");
}
export async function transitionQuestion(
  db: PrismaService,
  id: string,
  body: any,
  actor: Actor,
) {
  if (!actor.id) throw new ForbiddenException();
  if (
    typeof body?.requestId !== "string" ||
    !body.requestId ||
    body.requestId.length > 100 ||
    typeof body.questionVersionId !== "string" ||
    !Number.isInteger(body.expectedRevision)
  )
    throw new BadRequestException(
      "requestId, questionVersionId, expectedRevision шаардлагатай.",
    );
  if (
    body.comment !== undefined &&
    (typeof body.comment !== "string" || body.comment.length > 10000)
  )
    throw new BadRequestException("Invalid comment");
  return db.$transaction(
    async (tx) => {
      await lockQuestion(tx, id);
      const q = await tx.question.findUnique({
        where: { id },
        include: {
          versions: { orderBy: { versionNumber: "desc" } },
          classifications: {
            include: {
              topic: true,
              difficultyLevel: true,
              cognitiveLevels: { include: { cognitiveLevel: true } },
              assessmentContext: true,
              competences: true,
            },
          },
        },
      });
      if (!q || q.deletedAt) throw new NotFoundException();
      const previous = await tx.questionWorkflowEvent.findFirst({
        where: { questionId: id, requestId: body.requestId },
      });
      if (previous) {
        if (
          previous.actorUserId !== actor.id ||
          previous.action !== body.action ||
          previous.questionVersionId !== body.questionVersionId
        )
          throw new ConflictException("requestId давхар ашигласан байна.");
        return previous;
      }
      const v = q.versions[0];
      if (
        !v ||
        v.id !== body.questionVersionId ||
        q.revision !== body.expectedRevision
      )
        throw new ConflictException(
          "Даалгавар өөрчлөгдсөн байна. Хуудсаа шинэчилнэ үү.",
        );
      if (!actionsFor(q, actor).includes(body.action))
        throw new ForbiddenException("Энэ төлөвт уг үйлдлийг хийх эрхгүй.");
      if (
        ["changes_requested", "reject"].includes(body.action) &&
        !String(body.comment || "").trim()
      )
        throw new BadRequestException(
          "Буцаах / татгалзах тайлбараа оруулна уу.",
        );
      const next: Record<string, any> = {
        approval_requested: "IN_REVIEW",
        resubmitted: "IN_REVIEW",
        withdraw: "DRAFT",
        approve: "APPROVED",
        changes_requested: "CHANGES_REQUESTED",
        reject: "REJECTED",
        publish: "PUBLISHED",
        retire: "RETIRED",
      };
      let snapshot: any = undefined;
      if (["approval_requested", "resubmitted"].includes(body.action)) {
        const full = await tx.questionVersion.findUnique({
          where: { id: v.id },
          include: { options: true, media: true },
        });
        validateContent(full);
        const cs = q.classifications.filter(
          (c) =>
            !c.validatedQuestionVersionId ||
            c.validatedQuestionVersionId === v.id,
        );
        if (!cs.length)
          throw new BadRequestException("Сэдэв болон түвшнүүдээ сонгоно уу.");
        for (const c of cs) {
          const ctx = c.assessmentContext;
          if (
            !ctx.isActive ||
            !c.topic.isActive ||
            c.topic.assessmentContextId !== ctx.id ||
            !c.difficultyLevel.isActive ||
            c.difficultyLevel.difficultyScaleId !== ctx.difficultyScaleId ||
            !c.cognitiveLevels.length ||
            c.cognitiveLevels.some(
              (l) =>
                !l.cognitiveLevel.isActive ||
                l.cognitiveLevel.cognitiveFrameworkId !==
                  ctx.cognitiveFrameworkId,
            )
          )
            throw new BadRequestException(
              "Контекстийн сэдэв / түвшний тохиргоо хүчингүй байна.",
            );
          if (
            !actor.roles.includes("SUPER_ADMIN") &&
            !(await tx.assessorContextGrant.findUnique({
              where: {
                contextId_userId: { contextId: ctx.id, userId: actor.id },
              },
            }))
          )
            throw new ForbiddenException();
        }
        snapshot = JSON.parse(JSON.stringify(cs));
        await tx.topicQuestionClassification.updateMany({
          where: { id: { in: cs.map((c) => c.id) } },
          data: { validatedQuestionVersionId: v.id },
        });
      }
      if (
        ["approve", "publish"].includes(body.action) &&
        q.assessmentContextId &&
        !(await tx.assessmentContext.findFirst({
          where: { id: q.assessmentContextId, isActive: true },
        }))
      )
        throw new BadRequestException("Контекст идэвхгүй байна.");
      const review = ["approve", "changes_requested", "reject"].includes(
        body.action,
      );
      await tx.questionVersion.update({
        where: { id: v.id },
        data: {
          versionStatus: next[body.action],
          ...(snapshot ? { classificationSnapshot: snapshot } : {}),
          ...(review
            ? {
                reviewedBy: actor.id,
                reviewedAt: new Date(),
                reviewComment: body.comment || null,
              }
            : {}),
          ...(body.action === "publish"
            ? { publishedBy: actor.id, publishedAt: new Date() }
            : {}),
          ...(body.action === "retire" ? { retiredAt: new Date() } : {}),
        },
      });
      await tx.question.update({
        where: { id },
        data: {
          revision: { increment: 1 },
          ...(body.action === "publish"
            ? { currentPublishedVersionId: v.id }
            : {}),
          ...(body.action === "retire"
            ? { currentPublishedVersionId: null }
            : {}),
        },
      });
      const event = await tx.questionWorkflowEvent.create({
        data: {
          questionId: id,
          questionVersionId: v.id,
          requestId: body.requestId,
          previousStatus: v.versionStatus,
          newStatus: next[body.action],
          action: body.action,
          actorUserId: actor.id,
          actorRole: actor.roles.includes("SUPER_ADMIN")
            ? "SUPER_ADMIN"
            : "ASSESSOR",
          comment: body.comment || null,
        },
      });
      return event;
    },
    { timeout: 15000 },
  );
}
