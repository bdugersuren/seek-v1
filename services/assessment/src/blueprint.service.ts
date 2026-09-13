import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import { PrismaService } from "./prisma.service";
import { CreateBlueprintDto, UpdateBlueprintDto } from "./dto/blueprint.dto";
import {
  normalizeBlueprint,
  validateBlueprintInput,
  poolCatalog,
  assessPools,
} from "./blueprint-pools";
const include = {
  sections: {
    orderBy: { orderIndex: "asc" as const },
    include: { questions: { orderBy: { orderIndex: "asc" as const } } },
  },
  _count: { select: { quizzes: true } },
};
@Injectable()
export class BlueprintService {
  constructor(private readonly prisma: PrismaService) {}
  async candidates(query: any, owner: string) {
    const page = Number(query.page || 1),
      pageSize = Number(query.pageSize || 20);
    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(pageSize) ||
      pageSize < 1 ||
      pageSize > 100
    )
      throw new BadRequestException("Хуудасны хэмжээ 1–100 байна.");
    const c = await poolCatalog(
      this.prisma,
      String(query.assessmentContextId || ""),
      owner,
    );
    const r = assessPools(
      {
        name: "Сан",
        assessmentContextId: query.assessmentContextId,
        sections: [
          {
            name: "Сан",
            sectionMode: "RULE_BASED",
            selectionRules: { schemaVersion: 1 },
            randomPickCount: 0,
            pointsPerQuestion: 1,
            selectedQuestionIds: [],
          },
        ],
      },
      c,
    );
    const rows = r.sections[0].candidates.filter(
      (q) =>
        !query.search ||
        `${q.title} ${q.code}`
          .toLowerCase()
          .includes(String(query.search).toLowerCase()),
    );
    return {
      items: rows.slice((page - 1) * pageSize, page * pageSize),
      total: rows.length,
      page,
      pageSize,
    };
  }
  async preview(dto: any, ownerId: string) {
    const d = normalizeBlueprint(dto);
    validateBlueprintInput(d);
    return assessPools(
      d,
      await poolCatalog(this.prisma, d.assessmentContextId!, ownerId),
    );
  }
  async decorate(b: any, catalog?: any, detail = true) {
    try {
      const c =
        catalog ||
        (await poolCatalog(this.prisma, b.assessmentContextId, b.createdBy));
      const r = assessPools(b, c);
      const clean = {
        ...r,
        difficultyLevelIds: Array.from(
          new Set(
            r.sections.flatMap((s) =>
              s.candidates.map((q) => q.difficultyLevelId),
            ),
          ),
        ),
        sections: r.sections.map((s) =>
          detail
            ? s
            : {
                id: s.id,
                mode: s.mode,
                eligibleCount: s.eligibleCount,
                pick: s.pick,
                points: s.points,
              },
        ),
        selected: detail ? r.selected : undefined,
      };
      return {
        ...b,
        topicName: c.topics.find((t: any) => t.id === b.topicId)?.title || null,
        usageCount: b._count?.quizzes || 0,
        readiness: clean,
        allowedActions: [
          "view",
          "edit",
          "duplicate",
          ...(b.lifecycleStatus === "ARCHIVED" ? ["restore"] : ["archive"]),
          ...(r.status === "READY" ? ["create_quiz"] : []),
          ...(b._count?.quizzes ? [] : ["delete"]),
        ],
      };
    } catch (e) {
      return {
        ...b,
        topicName: null,
        usageCount: b._count?.quizzes || 0,
        readiness: {
          status: "UNAVAILABLE",
          issues: [
            {
              field: "sections",
              message: e instanceof Error ? e.message : "Шалгалт боломжгүй.",
            },
          ],
        },
        allowedActions: ["view", "edit", "duplicate"],
      };
    }
  }
  async create(dto: CreateBlueprintDto) {
    const d = normalizeBlueprint({
      ...dto,
      code: dto.code || `BP-${randomUUID()}`,
    });
    validateBlueprintInput(d);
    await this.validateReferences(d, dto.createdBy!);
    try {
      const id = await this.prisma.$transaction(async (tx) => {
        const b = await tx.quizTemplate.create({
          data: {
            assessmentContextId: d.assessmentContextId!,
            topicId: d.topicId,
            name: d.name.trim(),
            code: d.code!,
            description: d.description,
            defaultDurationMinutes: d.defaultDurationMinutes!,
            defaultPassingScore: d.defaultPassingScore!,
            createdBy: dto.createdBy!,
            lifecycleStatus: d.lifecycleStatus,
            totalQuestionCount: d.sections.reduce(
              (n, s) => n + s.randomPickCount,
              0,
            ),
            totalMaxScore: d.sections.reduce(
              (n, s) => n + s.randomPickCount * s.pointsPerQuestion,
              0,
            ),
          },
        });
        await this.saveSections(tx, b.id, d.sections, []);
        await this.audit(
          tx,
          b.id,
          dto.createdBy!,
          "create",
          null,
          d.lifecycleStatus!,
        );
        return b.id;
      });
      return this.findOne(id);
    } catch (e) {
      this.rethrow(e);
    }
  }
  async validateReferences(d: any, owner: string, existing: any[] = []) {
    if (!owner) throw new BadRequestException("Үүсгэгч шаардлагатай.");
    const c = await poolCatalog(this.prisma, d.assessmentContextId, owner);
    if (d.topicId && !c.topics.some((t: any) => t.id === d.topicId))
      throw new BadRequestException({
        field: "topicId",
        message: "Сэдэв контекстэд хамаарахгүй.",
      });
    const oldIds = new Set(
      existing.flatMap((s) => s.questions.map((q: any) => q.questionId)),
    );
    for (const [i, s] of d.sections.entries()) {
      for (const id of s.selectedQuestionIds)
        if (
          !oldIds.has(id) &&
          !c.rows.some((q: any) => q.id === id && q.classifications.length)
        )
          throw new BadRequestException({
            field: `sections.${i}.selectedQuestionIds`,
            message: "Асуулт контекстэд хамаарахгүй эсвэл эрхгүй.",
          });
      for (const [key, records] of [
        ["topicIds", c.topics],
        ["difficultyLevelIds", c.levels],
        ["audienceLevelIds", c.audiences],
      ] as any)
        if (
          s.selectionRules[key]?.some(
            (id: string) => !records.some((r: any) => r.id === id),
          )
        )
          throw new BadRequestException({
            field: `sections.${i}.selectionRules.${key}`,
            message: "Дүрмийн сонголт контекстэд хамаарахгүй.",
          });
    }
  }
  async saveSections(tx: any, id: string, sections: any[], old: any[]) {
    const kept = new Set(sections.map((s) => s.id).filter(Boolean));
    const removed = old.filter((s) => !kept.has(s.id));
    if (
      removed.length &&
      (await tx.quizRevisionSection.count({
        where: { sourceSectionId: { in: removed.map((s) => s.id) } },
      }))
    )
      throw new ConflictException(
        "Quiz-д ашиглагдсан хэсгийг устгахгүй. Blueprint-ийг хуулбарлаж бүтцийг өөрчилнө үү.",
      );
    for (const s of sections)
      if (s.id && !old.some((o) => o.id === s.id))
        throw new BadRequestException(
          "Хэсгийн ID энэ blueprint-д хамаарахгүй.",
        );
    if (removed.length)
      await tx.quizSection.deleteMany({
        where: { id: { in: removed.map((s) => s.id) } },
      });
    // Release unique order positions without changing the referenced section IDs.
    for (let i = 0; i < old.length; i++)
      if (kept.has(old[i].id))
        await tx.quizSection.update({
          where: { id: old[i].id },
          data: { orderIndex: -i - 1 },
        });
    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      const data = {
        title: s.name,
        description: s.description || "",
        questionCount: s.randomPickCount,
        maxScorePerQuestion: s.pointsPerQuestion,
        sectionMode: s.sectionMode,
        selectionRules: s.selectionRules,
        selectionStrategy: "RANDOM",
        orderIndex: i + 1,
      };
      const row = s.id
        ? await tx.quizSection.update({ where: { id: s.id }, data })
        : await tx.quizSection.create({ data: { ...data, templateId: id } });
      await tx.sectionQuestion.deleteMany({ where: { sectionId: row.id } });
      if (s.selectedQuestionIds.length)
        await tx.sectionQuestion.createMany({
          data: s.selectedQuestionIds.map((qid: string, j: number) => ({
            sectionId: row.id,
            questionId: qid,
            orderIndex: j + 1,
          })),
        });
    }
  }
  async audit(
    tx: any,
    id: string,
    actor: string,
    action: string,
    previous: string | null,
    next: string,
  ) {
    await tx.assessmentWorkflowEvent.create({
      data: {
        aggregateType: "blueprint",
        aggregateId: id,
        action,
        previousStatus: previous,
        newStatus: next,
        actorUserId: actor,
        metadata: {},
      },
    });
  }
  rethrow(e: any): never {
    if (e.code === "P2002")
      throw new ConflictException({
        field: "code",
        message: "Blueprint код давхардсан.",
      });
    throw e;
  }
  async update(id: string, dto: UpdateBlueprintDto, actor?: string) {
    const old = await this.prisma.quizTemplate.findUnique({
      where: { id },
      include,
    });
    if (!old) throw new NotFoundException("Blueprint олдсонгүй.");
    if (!Number.isInteger(dto.version) || dto.version !== old.version)
      throw new ConflictException(
        "Өөр хэрэглэгч эсвэл цонх шинэчилсэн. Өөрчлөлтөө хадгалж аваад дахин ачаална уу.",
      );
    if (
      dto.assessmentContextId &&
      dto.assessmentContextId !== old.assessmentContextId
    )
      throw new BadRequestException("Контекст солихгүй.");
    const d = normalizeBlueprint({
      ...old,
      ...dto,
      sections: dto.sections ?? old.sections,
    });
    validateBlueprintInput(d);
    await this.validateReferences(d, old.createdBy, old.sections);
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT id FROM quiz_template WHERE id=${id} FOR UPDATE`;
        const changed = await tx.quizTemplate.updateMany({
          where: { id, version: dto.version },
          data: {
            name: d.name.trim(),
            code: d.code,
            description: d.description,
            topicId: d.topicId,
            defaultDurationMinutes: d.defaultDurationMinutes,
            defaultPassingScore: d.defaultPassingScore,
            lifecycleStatus: d.lifecycleStatus,
            version: { increment: 1 },
            totalQuestionCount: d.sections.reduce(
              (n, s) => n + s.randomPickCount,
              0,
            ),
            totalMaxScore: d.sections.reduce(
              (n, s) => n + s.randomPickCount * s.pointsPerQuestion,
              0,
            ),
          },
        });
        if (changed.count !== 1)
          throw new ConflictException(
            "Blueprint өөрчлөгдсөн. Дахин ачаална уу.",
          );
        if (dto.sections)
          await this.saveSections(tx, id, d.sections, old.sections);
        await this.audit(
          tx,
          id,
          actor || old.createdBy,
          "update",
          old.lifecycleStatus,
          d.lifecycleStatus!,
        );
      });
      return this.findOne(id);
    } catch (e) {
      this.rethrow(e);
    }
  }
  async duplicate(id: string, actor: string) {
    const b = await this.prisma.quizTemplate.findUnique({
      where: { id },
      include,
    });
    if (!b) throw new NotFoundException();
    const d = normalizeBlueprint(b);
    return this.create({
      ...d,
      createdBy: actor,
      code: `BP-${randomUUID()}`,
      name: b.name.slice(0, 180) + " — хуулбар",
      lifecycleStatus: "DRAFT",
      sections: d.sections.map(({ id, ...s }) => s),
    });
  }
  async findOne(id: string) {
    const b = await this.prisma.quizTemplate.findUnique({
      where: { id },
      include,
    });
    if (!b) throw new NotFoundException("Blueprint олдсонгүй.");
    const linkedQuizzes = await this.prisma.quiz.findMany({
      where: { templateId: id, createdBy: b.createdBy },
      orderBy: { createdAt: 'desc' }, take: 20,
      select: {
        id: true, title: true,
        revisions: {
          orderBy: { revisionNumber: 'desc' }, take: 1,
          select: {
            id: true, title: true, revisionStatus: true, revisionNumber: true,
            sections: {
              orderBy: { orderIndex: 'asc' },
              select: { title: true, questions: {
                orderBy: { orderIndex: 'asc' },
                select: { questionId: true, questionVersionId: true, maxScore: true,
                  questionVersion: { select: { title: true, type: true } }
                }
              } }
            }
          }
        }
      }
    });
    return {...await this.decorate(b),linkedQuizzes};
  }
  async findAll(contextId?: string, allowed?: Set<string>, query: any = {}) {
    const rows = await this.prisma.quizTemplate.findMany({
      where: {
        ...(contextId ? { assessmentContextId: contextId } : {}),
        ...(allowed ? { id: { in: Array.from(allowed) } } : {}),
      },
      include,
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    });
    const catalogs = new Map<string, any>();
    const result: any[] = [];
    for (const row of rows) {
      const key = row.assessmentContextId + ":" + row.createdBy;
      if (!catalogs.has(key))
        try {
          catalogs.set(
            key,
            await poolCatalog(
              this.prisma,
              row.assessmentContextId,
              row.createdBy,
            ),
          );
        } catch {
          catalogs.set(key, null);
        }
      result.push(await this.decorate(row, catalogs.get(key), false));
    }
    if (query.paged !== "true") return result;
    const page = Number(query.page || 1),
      pageSize = Number(query.pageSize || 20);
    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(pageSize) ||
      pageSize < 1 ||
      pageSize > 100
    )
      throw new BadRequestException("Хуудасны хэмжээ 1–100 байна.");
    if (typeof query.search === "string" && query.search.length > 500)
      throw new BadRequestException("Хайлтын текст хэт урт.");
    const csv = (key: string) =>
      String(query[key] || "")
        .split(",")
        .filter(Boolean);
    const filtered = result.filter(
      (b) =>
        (!query.search ||
          `${b.name} ${b.code} ${b.description || ""}`
            .toLowerCase()
            .includes(String(query.search).toLowerCase())) &&
        (!csv("topics").length || csv("topics").includes(b.topicId)) &&
        (!query.lifecycle || b.lifecycleStatus === query.lifecycle) &&
        (!query.readiness || b.readiness.status === query.readiness) &&
        (!query.mode ||
          b.sections.some((s: any) => s.sectionMode === query.mode)) &&
        (!csv("difficulties").length ||
          b.readiness.difficultyLevelIds?.some((id: string) =>
            csv("difficulties").includes(id),
          )),
    );
    const actual = Math.min(
      page,
      Math.max(1, Math.ceil(filtered.length / pageSize)),
    );
    return {
      items: filtered
        .slice((actual - 1) * pageSize, actual * pageSize)
        .map((b) => ({
          ...b,
          sections: b.sections.map(({ questions, ...s }: any) => s),
        })),
      total: filtered.length,
      page: actual,
      pageSize,
      summary: {
        total: result.length,
        ready: result.filter((b) => b.readiness.status === "READY").length,
        attention: result.filter(
          (b) => b.readiness.status === "NEEDS_ATTENTION",
        ).length,
      },
      facets: {
        topics: Array.from(
          new Set(result.map((b) => b.topicId).filter(Boolean)),
        ),
        difficulties: Array.from(
          new Map(
            Array.from(catalogs.values())
              .filter(Boolean)
              .flatMap((c) => c.levels)
              .map((l: any) => [l.id, l]),
          ).values(),
        ),
      },
    };
  }
  async remove(id: string) {
    const usedMessage =
      "Энэ blueprint quiz-д ашиглагдсан тул устгах боломжгүй.";
    try {
      return await this.prisma.$transaction(async (tx) => {
        // Serialize deletion with FK references created by concurrent quiz requests.
        const rows = await tx.$queryRaw<Array<{ id: string }>>`
          SELECT id FROM quiz_template WHERE id = ${id} FOR UPDATE
        `;
        if (!rows.length) throw new NotFoundException("Blueprint олдсонгүй.");
        const used = await tx.quiz.count({ where: { templateId: id } });
        const snapshots = await tx.quizRevisionSection.count({
          where: { sourceSection: { templateId: id } },
        });
        if (used || snapshots) throw new ConflictException(usedMessage);
        // Cascades remove only template sections and their links, never questions.
        return await tx.quizTemplate.delete({ where: { id } });
      });
    } catch (error) {
      if ((error as { code?: string }).code === "P2003") {
        throw new ConflictException(usedMessage);
      }
      throw error;
    }
  }
}
