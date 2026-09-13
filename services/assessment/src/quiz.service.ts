import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import { materializeBlueprint } from "./blueprint-materialize";
import { poolCatalog, assessPools } from "./blueprint-pools";
import { PrismaService } from "./prisma.service";
import { CreateQuizDto, UpdateQuizDto } from "./dto/quiz.dto";
import { Actor, lockQuestion } from "./question-workflow";
import {
  quizActions,
  quizSettings,
  snapshotReadiness,
  assertQuizVersion,
  requireQuizAction,
  quizHash,
  quizRequest,
} from "./quiz-workflow";
const revisionInclude = {
  sections: {
    orderBy: { orderIndex: "asc" as const },
    include: {
      questions: {
        orderBy: { orderIndex: "asc" as const },
        include: {
          question: true,
          questionVersion: { include: { options: true, media: true } },
        },
      },
    },
  },
};
const detailInclude = {
  template: true,
  revisions: {
    orderBy: { revisionNumber: "desc" as const },
    include: revisionInclude,
  },
  currentPublishedRevision: true,
};
@Injectable()
export class QuizService {
  constructor(private readonly prisma: PrismaService) {}
  async load(db: any, id: string) {
    const q = await db.quiz.findUnique({
      where: { id },
      include: detailInclude,
    });
    if (!q) throw new NotFoundException("Quiz олдсонгүй.");
    return q;
  }
  async locked(tx: any, id: string, dto: any) {
    await tx.$queryRaw`SELECT id FROM quiz WHERE id=${id} FOR UPDATE`;
    const q = await this.load(tx, id);
    assertQuizVersion(q, dto);
    return q;
  }
  actor(q: any, actor?: Actor | string): Actor {
    return typeof actor === "string"
      ? { id: actor, roles: ["ASSESSOR"] }
      : actor || { id: q.createdBy, roles: ["ASSESSOR"] };
  }
  async readiness(db: any, q: any, r: any) {
    const result = snapshotReadiness(q, r);
    const context = await db.assessmentContext.findUnique({
      where: { id: r.assessmentContextId },
    });
    if (!context?.isActive) result.issues.push("Контекст идэвхгүй.");
    if (
      !(await db.assessorContextGrant.count({
        where: { contextId: r.assessmentContextId, userId: q.createdBy },
      }))
    )
      result.issues.push("Зохиогчийн контекстийн эрх цуцлагдсан.");
    result.status = result.issues.length ? "NEEDS_ATTENTION" : "READY";
    return result;
  }
  async findOne(id: string, actor?: Actor, revisionId?: string) {
    const q = await this.load(this.prisma, id),
      selected = q.revisions.find(
        (r: any) => r.id === (revisionId || q.revisions[0]?.id),
      );
    if (!selected) throw new NotFoundException("Quiz хувилбар олдсонгүй.");
    const readiness = await this.readiness(this.prisma, q, selected);
    for (const rev of q.revisions)
      for (const section of rev.sections)
        for (const item of section.questions)
          if (item.question.ownerUserId !== q.createdBy) {
            item.question = { id: item.questionId };
            item.questionVersion = null;
          }
    return {
      ...q,
      selectedRevision: selected,
      readiness,
      allowedActions: quizActions(q, selected, this.actor(q, actor)),
      workflow: await this.prisma.assessmentWorkflowEvent.findMany({
        where: { aggregateType: "quiz", aggregateId: id },
        orderBy: { occurredAt: "asc" },
      }),
    };
  }
  async findAll(
    contextId?: string,
    allowedIds?: Set<string>,
    query: any = {},
    actor?: Actor,
  ) {
    const where: any = {
      ...(contextId ? { template: { assessmentContextId: contextId } } : {}),
      ...(allowedIds ? { id: { in: [...allowedIds] } } : {}),
    };
    const rows = await this.prisma.quiz.findMany({
      where,
      include: {
        template: { select: { name: true, assessmentContextId: true } },
        revisions: { orderBy: { revisionNumber: "desc" }, take: 1 },
        currentPublishedRevision: true,
      },
      orderBy: { updatedAt: "desc" },
    });
    if (query.paged !== "true") return rows;
    const page = Number(query.page || 1),
      pageSize = Number(query.pageSize || 12);
    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(pageSize) ||
      pageSize < 1 ||
      pageSize > 100
    )
      throw new BadRequestException("Хуудасны хэмжээ буруу.");
    const filtered = rows.filter(
      (q) =>
        (!query.search ||
          `${q.code} ${q.revisions[0]?.title || q.title}`
            .toLowerCase()
            .includes(String(query.search).toLowerCase())) &&
        (!query.status || q.revisions[0]?.revisionStatus === query.status) &&
        (!query.blueprintId || q.templateId === query.blueprintId),
    );
    return {
      items: filtered.slice((page - 1) * pageSize, page * pageSize),
      total: filtered.length,
      page,
      pageSize,
      facets: {
        blueprints: [
          ...new Map(
            rows.map((q) => [
              q.templateId,
              { id: q.templateId, name: q.template.name },
            ]),
          ).values(),
        ],
      },
      summary: {
        total: rows.length,
        published: rows.filter((q) => q.currentPublishedRevisionId).length,
        inReview: rows.filter(
          (q) => q.revisions[0]?.revisionStatus === "IN_REVIEW",
        ).length,
      },
    };
  }
  async create(dto: CreateQuizDto) {
    quizSettings(dto);
    if (!dto.title || !dto.blueprintId || !dto.createdBy)
      throw new BadRequestException("Нэр, Blueprint, хэрэглэгч шаардлагатай.");
    const actor = this.actor(dto);
    const id = await this.prisma.$transaction(
      (tx) =>
        quizRequest(tx, actor, "create", dto, async () => {
          await tx.$queryRaw`SELECT id FROM quiz_template WHERE id=${dto.blueprintId} FOR UPDATE`;
          const b = await tx.quizTemplate.findUnique({
            where: { id: dto.blueprintId },
          });
          if (!b) throw new NotFoundException("Blueprint олдсонгүй.");
          if (
            !Number.isInteger(dto.expectedBlueprintVersion) ||
            dto.expectedBlueprintVersion !== b.version
          )
            throw new ConflictException(
              "Blueprint өөрчлөгдсөн. Шинэ тохиргоог шалгана уу.",
            );
          const q = await tx.quiz.create({
            data: {
              templateId: b.id,
              code: "quiz-" + randomUUID(),
              title: dto.title.trim(),
              createdBy: actor.id,
              version: 1,
            },
          });
          const r = await tx.quizRevision.create({
            data: {
              quizId: q.id,
              revisionNumber: 1,
              revisionStatus: "DRAFT",
              assessmentContextId: b.assessmentContextId!,
              title: dto.title.trim(),
              description: dto.description || null,
              durationMinutes: dto.durationMinutes ?? b.defaultDurationMinutes,
              passingScore: dto.passingScore ?? b.defaultPassingScore,
              maxAttempts: dto.maxAttempts ?? 1,
              createdBy: actor.id,
              runtimePolicy: {
                questionOverrides: dto.questionOverrides || [],
              } as any,
            },
          });
          await materializeBlueprint(
            tx,
            b.id,
            r.id,
            dto.questionOverrides || [],
          );
          return q.id;
        }),
      { timeout: 30000 },
    );
    return this.findOne(id, actor);
  }
  async bump(tx: any, q: any, actor: Actor) {
    await tx.quiz.update({
      where: { id: q.id },
      data: { version: { increment: 1 }, updatedBy: actor.id },
    });
  }
  async update(id: string, dto: UpdateQuizDto, actorInput?: Actor | string) {
    quizSettings(dto);
    await this.prisma.$transaction(
      async (tx) => {
        const q = await this.locked(tx, id, dto),
          actor = this.actor(q, actorInput),
          r = q.revisions.find((r: any) => r.id === dto.quizRevisionId);
        requireQuizAction(q, r, actor, "save");
        const old = r.runtimePolicy?.questionOverrides || [],
          overrides = dto.questionOverrides ?? old;
        if (!dto.reselectQuestions && quizHash(overrides) !== quizHash(old))
          throw new BadRequestException(
            "Override өөрчлөхдөө дахин бүрдүүлэх үйлдлийг ашиглана уу.",
          );
        await tx.quizRevision.update({
          where: { id: r.id },
          data: {
            title: dto.title?.trim(),
            description: dto.description,
            durationMinutes: dto.durationMinutes,
            passingScore: dto.passingScore,
            maxAttempts: dto.maxAttempts,
            runtimePolicy: { ...r.runtimePolicy, questionOverrides: overrides },
          },
        });
        if (dto.reselectQuestions)
          await materializeBlueprint(tx, q.templateId, r.id, overrides);
        await this.bump(tx, q, actor);
      },
      { timeout: 30000 },
    );
    return this.findOne(
      id,
      typeof actorInput === "object" ? actorInput : undefined,
      dto.quizRevisionId,
    );
  }
  async preview(id: string, dto: any, actor: Actor) {
    const q = await this.load(this.prisma, id);
    assertQuizVersion(q, dto);
    const r = q.revisions.find((r: any) => r.id === dto.quizRevisionId);
    requireQuizAction(q, r, actor, "reselect");
    quizSettings(dto);
    const b = await this.prisma.quizTemplate.findUniqueOrThrow({
      where: { id: q.templateId },
      include: {
        sections: {
          orderBy: { orderIndex: "asc" },
          include: { questions: true },
        },
      },
    });
    return assessPools(
      b,
      await poolCatalog(this.prisma, b.assessmentContextId, b.createdBy),
      randomUUID(),
      dto.questionOverrides || [],
    );
  }
  async newRevision(id: string, dto: any, actor: Actor) {
    await this.prisma.$transaction(
      async (tx) => {
        const q = await this.locked(tx, id, dto),
          r = q.revisions.find((r: any) => r.id === dto.quizRevisionId);
        requireQuizAction(q, r, actor, "new_revision");
        const {
          id: oldId,
          sections,
          revisionNumber,
          revisionStatus,
          createdAt,
          createdBy,
          reviewedBy,
          reviewedAt,
          approvedBy,
          approvedAt,
          publishedBy,
          publishedAt,
          retiredAt,
          approvalComment,
          ...settings
        } = r;
        const next = await tx.quizRevision.create({
          data: {
            ...settings,
            revisionNumber: q.revisions[0].revisionNumber + 1,
            revisionStatus: "DRAFT",
            questionManifestHash: null,
            createdBy: actor.id,
          },
        });
        for (const s of sections) {
          const { id: oldSection, quizRevisionId, questions, ...data } = s;
          const ns = await tx.quizRevisionSection.create({
            data: { ...data, quizRevisionId: next.id },
          });
          for (const item of questions) {
            const {
              id: oldQuestion,
              revisionSectionId,
              question,
              questionVersion,
              ...data
            } = item;
            await tx.quizRevisionQuestion.create({
              data: { ...data, revisionSectionId: ns.id },
            });
          }
        }
        await this.bump(tx, q, actor);
      },
      { timeout: 30000 },
    );
    return this.findOne(id, actor);
  }
  async transition(id: string, dto: any, actor: Actor) {
    if(dto?.comment!==undefined && (typeof dto.comment!=="string" || dto.comment.length>20000)) throw new BadRequestException("Тайлбарын формат буруу.");
    await this.prisma.$transaction(
      (tx) =>
        quizRequest(tx, actor, "workflow:" + id, dto, async () => {
          const q = await this.locked(tx, id, dto),
            r = q.revisions.find((r: any) => r.id === dto.quizRevisionId);
          requireQuizAction(q, r, actor, dto.action);
          if (
            ![
              "approval_requested",
              "withdraw",
              "approve",
              "changes_requested",
              "publish",
              "reopen",
            ].includes(dto.action)
          )
            throw new BadRequestException("Workflow үйлдэл буруу.");
          if (
            dto.action === "changes_requested" &&
            (typeof dto.comment !== "string" || !dto.comment.trim())
          )
            throw new BadRequestException("Буцаах тайлбар шаардлагатай.");
          if (
            ["approval_requested", "approve", "publish"].includes(dto.action)
          ) {
            for (const qid of [
              ...new Set<string>(
                r.sections.flatMap((s: any) =>
                  s.questions.map((x: any) => x.questionId),
                ),
              ),
            ].sort())
              await lockQuestion(tx, qid);
            const fresh = await this.load(tx, id),
              fr = fresh.revisions.find((x: any) => x.id === r.id),
              ready = await this.readiness(tx, fresh, fr);
            if (ready.issues.length)
              throw new BadRequestException({
                message: "Quiz ашиглахад бэлэн биш.",
                issues: ready.issues,
              });
          }
          const status = {
            approval_requested: "IN_REVIEW",
            withdraw: "DRAFT",
            approve: "APPROVED",
            changes_requested: "DRAFT",
            publish: "PUBLISHED",
            reopen: "DRAFT",
          }[dto.action];
          const data: any = { revisionStatus: status };
          if (dto.action === "approve")
            Object.assign(data, {
              approvedBy: actor.id,
              approvedAt: new Date(),
              reviewedBy: actor.id,
              reviewedAt: new Date(),
              approvalComment: dto.comment || null,
            });
          if (dto.action === "changes_requested")
            Object.assign(data, {
              reviewedBy: actor.id,
              reviewedAt: new Date(),
              approvalComment: dto.comment,
              approvedBy: null,
              approvedAt: null,
            });
          if (dto.action === "publish") {
            const manifest = r.sections.map((s: any) => ({
              id: s.id,
              questions: s.questions.map((x: any) => ({
                id: x.questionId,
                version: x.questionVersionId,
                score: String(x.maxScore),
              })),
            }));
            Object.assign(data, {
              publishedBy: actor.id,
              publishedAt: new Date(),
              questionManifestHash: quizHash(manifest),
            });
            await tx.quiz.update({
              where: { id },
              data: {
                currentPublishedRevisionId: r.id,
                title: r.title,
                lifecycleStatus: "PUBLISHED",
              },
            });
          }
          await tx.quizRevision.update({ where: { id: r.id }, data });
          await this.bump(tx, q, actor);
          await tx.assessmentWorkflowEvent.create({
            data: {
              aggregateType: "quiz",
              aggregateId: id,
              previousStatus: r.revisionStatus,
              newStatus: status,
              action: dto.action,
              comment: dto.comment || null,
              actorUserId: actor.id,
              metadata: {
                quizRevisionId: r.id,
                actorRoles: actor.roles,
                requestId: dto.requestId,
              },
            },
          });
          return id;
        }),
      { timeout: 30000 },
    );
    return this.findOne(id, actor, dto.quizRevisionId);
  }
  async remove(id: string) {
    throw new BadRequestException(
      "Quiz устгах боломжгүй. Нийтэлсэн хувилбарын түүхийг хадгална.",
    );
  }
}
