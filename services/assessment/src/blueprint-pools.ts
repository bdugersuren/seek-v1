import { BadRequestException } from "@nestjs/common";
import { selectPoolQuestions, Override } from "./blueprint-selection";
import { CreateBlueprintDto, PoolRules } from "./dto/blueprint.dto";
export const RUNTIME_TYPES = [
  "SINGLE_CHOICE",
  "MULTIPLE_CHOICE",
  "TRUE_FALSE",
  "SHORT_TEXT",
  "NUMERIC",
  "ESSAY",
  "MATCHING",
  "MATRIX",
];
export const ALL_TYPES = [
  ...RUNTIME_TYPES,
  "ORDERING",
  "FILL_BLANK",
  "LIKERT",
  "SJT",
  "CASE_BUNDLE",
];
const fail = (field: string, message: string): never => {
  throw new BadRequestException({ message, field });
};
export function validateBlueprintInput(d: any) {
  if (!d || typeof d !== "object") fail("body", "Тохиргоо шаардлагатай.");
  if (typeof d.name !== "string" || !d.name.trim() || d.name.length > 200)
    fail("name", "Нэр 1–200 тэмдэгт байна.");
  if (
    d.code !== undefined &&
    (typeof d.code !== "string" || !d.code.trim() || d.code.length > 100)
  )
    fail("code", "Код 1–100 тэмдэгт байна.");
  if (typeof d.assessmentContextId !== "string" || !d.assessmentContextId)
    fail("assessmentContextId", "Контекст шаардлагатай.");
  if (
    d.description !== undefined &&
    (typeof d.description !== "string" || d.description.length > 10000)
  )
    fail("description", "Тайлбар хэт урт.");
  if (
    !Number.isInteger(d.defaultDurationMinutes) ||
    d.defaultDurationMinutes < 1 ||
    d.defaultDurationMinutes > 1440
  )
    fail("defaultDurationMinutes", "Хугацаа 1–1440 минут байна.");
  if (
    typeof d.defaultPassingScore !== "number" ||
    !Number.isFinite(d.defaultPassingScore) ||
    d.defaultPassingScore < 0 ||
    d.defaultPassingScore > 100
  )
    fail("defaultPassingScore", "Босго 0–100 хувь байна.");
  if (!["DRAFT", "ARCHIVED"].includes(d.lifecycleStatus))
    fail("lifecycleStatus", "Ноорог эсвэл архив төлөв сонгоно уу.");
  if (!Array.isArray(d.sections) || d.sections.length > 100)
    fail("sections", "Хэсгийн тоо 100-аас ихгүй байна.");
  const ids = new Set<string>();
  d.sections.forEach((s: any, i: number) => {
    const f = `sections.${i}`;
    if (s.id) {
      if (typeof s.id !== "string" || ids.has(s.id))
        fail(f + ".id", "Хэсгийн ID давхардсан.");
      ids.add(s.id);
    }
    if (typeof s.name !== "string" || s.name.length > 200)
      fail(f + ".name", "Хэсгийн нэрийн формат буруу.");
    if (
      !Number.isInteger(s.randomPickCount) ||
      s.randomPickCount < 0 ||
      s.randomPickCount > 500
    )
      fail(f + ".randomPickCount", "Сонгох тоо 0–500 бүхэл тоо байна.");
    if (
      typeof s.pointsPerQuestion !== "number" ||
      !Number.isFinite(s.pointsPerQuestion) ||
      s.pointsPerQuestion < 0 ||
      s.pointsPerQuestion > 10000
    )
      fail(f + ".pointsPerQuestion", "Оноо 0–10000 байна.");
    if (!["FIXED", "RULE_BASED"].includes(s.sectionMode))
      fail(f + ".sectionMode", "Сангийн горим хүчингүй.");
    if (
      !Array.isArray(s.selectedQuestionIds) ||
      s.selectedQuestionIds.length > 5000 ||
      s.selectedQuestionIds.some((x: any) => typeof x !== "string" || !x) ||
      new Set(s.selectedQuestionIds).size !== s.selectedQuestionIds.length
    )
      fail(
        f + ".selectedQuestionIds",
        "Асуултын ID жагсаалт хүчингүй эсвэл давхардсан.",
      );
    if (s.sectionMode === "RULE_BASED" && s.selectedQuestionIds.length)
      fail(
        f + ".selectedQuestionIds",
        "Дүрмийн санд гараар сонгосон ID хадгалахгүй.",
      );
    const r = s.selectionRules;
    if (
      !r ||
      typeof r !== "object" ||
      Array.isArray(r) ||
      r.schemaVersion !== 1
    )
      fail(f + ".selectionRules", "Дүрмийн хувилбар 1 байна.");
    for (const k of Object.keys(r))
      if (
        ![
          "schemaVersion",
          "topicIds",
          "includeDescendants",
          "types",
          "difficultyLevelIds",
          "audienceLevelIds",
        ].includes(k)
      )
        fail(f + ".selectionRules", "Дэмжигдээгүй дүрмийн талбар.");
    for (const k of [
      "topicIds",
      "types",
      "difficultyLevelIds",
      "audienceLevelIds",
    ])
      if (
        r[k] !== undefined &&
        (!Array.isArray(r[k]) ||
          r[k].length > 500 ||
          r[k].some((v: any) => typeof v !== "string" || !v) ||
          new Set(r[k]).size !== r[k].length)
      )
        fail(f + ".selectionRules." + k, "Дүрмийн жагсаалт хүчингүй.");
    if (
      r.includeDescendants !== undefined &&
      typeof r.includeDescendants !== "boolean"
    )
      fail(f + ".selectionRules", "Дэд сэдвийн сонголт буруу.");
    if (r.types?.some((t: string) => !ALL_TYPES.includes(t)))
      fail(f + ".selectionRules.types", "Асуултын төрөл хүчингүй.");
  });
  if (d.sections.reduce((n: number, s: any) => n + s.randomPickCount, 0) > 500)
    fail("sections", "Нийт сонголт 500-аас ихгүй байна.");
}
export const normalizeBlueprint = (b: any): CreateBlueprintDto => {
  if(!b || typeof b!=='object' || Array.isArray(b)) fail('body','Тохиргооны формат буруу.');
  if(b.sections!==undefined && (!Array.isArray(b.sections)||b.sections.some((s:any)=>!s||typeof s!=='object'||Array.isArray(s)))) fail('sections','Хэсгүүдийн формат буруу.');
  return ({
  name: b.name,
  code: b.code,
  description: b.description || "",
  assessmentContextId: b.assessmentContextId,
  topicId: b.topicId || null,
  defaultDurationMinutes: b.defaultDurationMinutes ?? 60,
  defaultPassingScore: Number(b.defaultPassingScore ?? 70),
  lifecycleStatus: b.lifecycleStatus === "ARCHIVED" ? "ARCHIVED" : "DRAFT",
  sections: (b.sections || []).map((s: any) => ({
    id: s.id,
    name: s.name ?? s.title ?? "",
    description: s.description || "",
    sectionMode: s.sectionMode || "FIXED",
    selectionRules: { schemaVersion: 1, ...(s.selectionRules || {}) },
    randomPickCount: s.randomPickCount ?? s.questionCount ?? 0,
    pointsPerQuestion: Number(
      s.pointsPerQuestion ?? s.maxScorePerQuestion ?? 1,
    ),
    selectedQuestionIds:
      s.selectedQuestionIds ??
      (s.questions || []).map((q: any) => q.questionId),
  })),
});
};
export async function poolCatalog(db: any, contextId: string, ownerId: string) {
  const context = await db.assessmentContext.findUnique({
    where: { id: contextId },
  });
  if (!context?.isActive)
    throw new BadRequestException("Контекст идэвхгүй эсвэл олдсонгүй.");
  const [topics, levels, audiences, rows] = await Promise.all([
    db.topic.findMany({
      where: { assessmentContextId: contextId, isActive: true },
      select: { id: true, parentId: true, title: true },
    }),
    db.difficultyLevel.findMany({
      where: { difficultyScaleId: context.difficultyScaleId, isActive: true },
      select: { id: true, name: true, code: true },
    }),
    db.audienceLevel.findMany({
      where: { audienceTypeId: context.audienceTypeId, isActive: true },
      select: { id: true, name: true },
    }),
    db.question.findMany({
      where: {
        ownerUserId: ownerId,
        deletedAt: null,
        OR: [
          { assessmentContextId: contextId },
          {
            assessmentContextId: null,
            classifications: { some: { assessmentContextId: contextId } },
          },
        ],
      },
      select: {
        id: true,
        code: true,
        lifecycleStatus: true,
        currentPublishedVersion: {
          select: {
            id: true,
            type: true,
            title: true,
            versionStatus: true,
            classificationSnapshot: true,
          },
        },
        classifications: {
          where: { assessmentContextId: contextId },
          select: {
            assessmentContextId: true,
            topicId: true,
            difficultyLevelId: true,
            validatedQuestionVersionId: true,
            assessmentContext: { select: { audienceLevelId: true } },
          },
        },
      },
    }),
  ]);
  return { context, topics, levels, audiences, rows };
}
export function assessPools(
  input: any,
  catalog: any,
  seed = "blueprint-preview",
  overrides: Override[] = [],
) {
  const d = normalizeBlueprint(input);
  validateBlueprintInput(d);
  const issues: { field: string; message: string }[] = [];
  const add = (field: string, message: string) =>
    issues.push({ field, message });
  if (d.topicId && !catalog.topics.some((t: any) => t.id === d.topicId))
    add("topicId", "Үндсэн сэдэв контекстэд байхгүй.");
  if (d.lifecycleStatus === "ARCHIVED")
    add("lifecycleStatus", "Архивлагдсан загвараар Quiz үүсгэхгүй.");
  if (!d.sections.length) add("sections", "Дор хаяж нэг хэсэг нэмнэ үү.");
  const expanded = (r: PoolRules) => {
    const set = new Set(r.topicIds || []);
    if (r.includeDescendants !== false) {
      let changed = true;
      while (changed) {
        changed = false;
        for (const t of catalog.topics)
          if (t.parentId && set.has(t.parentId) && !set.has(t.id)) {
            set.add(t.id);
            changed = true;
          }
      }
    }
    return set;
  };
  const sections = d.sections.map((s, i) => {
    const rules = s.selectionRules!;
    const field = `sections.${i}`;
    const topics = expanded(rules);
    for (const [key, records] of [
      ["topicIds", catalog.topics],
      ["difficultyLevelIds", catalog.levels],
      ["audienceLevelIds", catalog.audiences],
    ] as any)
      if (
        (rules as any)[key]?.some(
          (id: string) => !records.some((r: any) => r.id === id),
        )
      )
        add(
          field + ".selectionRules." + key,
          "Контекстэд хамаарахгүй эсвэл идэвхгүй шүүлтүүр.",
        );
    if (!s.name.trim()) add(field + ".name", "Хэсгийн нэр шаардлагатай.");
    if (s.randomPickCount < 1)
      add(field + ".randomPickCount", "Дор хаяж нэг асуулт сонгоно уу.");
    if (s.pointsPerQuestion <= 0)
      add(field + ".pointsPerQuestion", "Оноо тэгээс их байна.");
    const candidates: any[] = [];
    const rejected: { id: string; reason: string }[] = [];
    for (const q of catalog.rows) {
      const v = q.currentPublishedVersion;
      const cs = (
        Array.isArray(v?.classificationSnapshot)
          ? v.classificationSnapshot
          : q.classifications.filter(
              (c: any) =>
                !c.validatedQuestionVersionId ||
                c.validatedQuestionVersionId === v?.id,
            )
      ).filter((c: any) => c.assessmentContextId === d.assessmentContextId);
      const isFixed = s.sectionMode === "FIXED";
      if (isFixed && !s.selectedQuestionIds.includes(q.id)) continue;
      if (!isFixed && rules.types?.length && !rules.types.includes(v?.type))
        continue;
      const matching = cs.find(
        (c: any) =>
          (!topics.size || topics.has(c.topicId)) &&
          (!rules.difficultyLevelIds?.length ||
            rules.difficultyLevelIds.includes(c.difficultyLevelId)) &&
          (!rules.audienceLevelIds?.length ||
            rules.audienceLevelIds.includes(
              c.assessmentContext?.audienceLevelId ||
                catalog.context.audienceLevelId,
            )),
      );
      if (!isFixed && !matching) continue;
      let reason = "";
      if (
        !v ||
        v.versionStatus !== "PUBLISHED" ||
        q.lifecycleStatus !== "ACTIVE"
      )
        reason = "Хүчинтэй нийтлэгдсэн хувилбар байхгүй.";
      else if (!RUNTIME_TYPES.includes(v.type))
        reason = `${v.type}: runtime дэмжлэг нээгдээгүй.`;
      else if (
        !cs.some(
          (c: any) =>
            catalog.topics.some((t: any) => t.id === c.topicId) &&
            catalog.levels.some((l: any) => l.id === c.difficultyLevelId),
        )
      )
        reason = "Нийтлэгдсэн ангиллын сэдэв/түвшин хүчинтэй биш.";
      if (reason) {
        rejected.push({ id: q.id, reason });
        continue;
      }
      const c = matching || cs[0];
      candidates.push({
        id: q.id,
        versionId: v.id,
        code: q.code,
        title: v.title,
        type: v.type,
        topicId: c.topicId,
        difficultyLevelId: c.difficultyLevelId,
      });
    }
    if (s.sectionMode === "FIXED")
      for (const id of s.selectedQuestionIds)
        if (!catalog.rows.some((q: any) => q.id === id))
          rejected.push({ id, reason: "Асуулт устсан эсвэл хандах эрхгүй." });
    if (s.randomPickCount > candidates.length)
      add(
        field + ".randomPickCount",
        `${candidates.length} боломжтой асуултаас ${s.randomPickCount} сонгох боломжгүй.`,
      );
    if (s.sectionMode === "FIXED" && rejected.length)
      add(
        field + ".selectedQuestionIds",
        `${rejected.length} асуултын холбоосыг засах шаардлагатай.`,
      );
    return {
      id: s.id || `preview-${i}`,
      name: s.name,
      mode: s.sectionMode,
      rules,
      ruleSummary: [
        rules.topicIds?.length
          ? "Сэдэв: " +
            rules.topicIds
              .map(
                (id) =>
                  catalog.topics.find((t: any) => t.id === id)?.title ||
                  "Тохируулаагүй",
              )
              .join(", ")
          : "Бүх сэдэв",
        rules.types?.length ? "Төрөл: " + rules.types.join(", ") : "Бүх төрөл",
        rules.difficultyLevelIds?.length
          ? "Түвшин: " +
            rules.difficultyLevelIds
              .map(
                (id) =>
                  catalog.levels.find((l: any) => l.id === id)?.name ||
                  "Тохируулаагүй",
              )
              .join(", ")
          : "Бүх түвшин",
        rules.includeDescendants === false
          ? "Дэд сэдэв оруулахгүй"
          : "Дэд сэдэв хамарна",
      ],
      eligibleCount: candidates.length,
      candidates,
      rejected,
      pick: s.randomPickCount,
      points: s.pointsPerQuestion,
    };
  });
  let selected: Record<string, string[]> = {};
  if (!issues.length)
    try {
      selected = selectPoolQuestions(
        sections.map((s) => ({
          id: s.id,
          count: s.pick,
          candidateIds: s.candidates.map((q) => q.id),
        })),
        seed,
        overrides,
      );
    } catch (e) {
      add("sections", e instanceof Error ? e.message : "Сонголт хүчингүй.");
    }
  const poolIds = Array.from(
    new Set(sections.flatMap((s) => s.candidates.map((q) => q.id))),
  );
  return {
    status: issues.length ? "NEEDS_ATTENTION" : "READY",
    issues,
    seed,
    sections,
    selected,
    summary: {
      sectionCount: sections.length,
      pooledQuestions: sections.reduce((n, s) => n + s.eligibleCount, 0),
      uniquePoolQuestions: poolIds.length,
      pickedQuestions: sections.reduce((n, s) => n + s.pick, 0),
      totalPoints: sections.reduce((n, s) => n + s.pick * s.points, 0),
    },
    asOf: new Date().toISOString(),
  };
}
