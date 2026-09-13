import { BadRequestException } from "@nestjs/common";
import { Prisma } from "../generated/prisma-client";
import { PrismaService } from "./prisma.service";

export async function questionBank(
  db: PrismaService,
  input: any,
  allowedIds?: Set<string>,
) {
  const list = (key: string): string[] => {
    const value = input[key];
    if (value === undefined || value === "") return [];
    if (typeof value !== "string" || value.length > 20000)
      throw new BadRequestException("Шүүлтүүрийн формат буруу");
    return value.split(",").filter(Boolean);
  };
  const page = Number(input.page || 1),
    pageSize = Number(input.pageSize || 20);
  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(pageSize) ||
    pageSize < 1 ||
    pageSize > 100
  )
    throw new BadRequestException("Хуудасны хэмжээ 1–100 байна.");
  const types = list("types"),
    statuses = list("statuses"),
    difficulties = list("difficulties"),
    topics = list("topics"),
    audiences = list("audiences");
  if (
    typeof input.search !== "undefined" &&
    (typeof input.search !== "string" || input.search.length > 500)
  )
    throw new BadRequestException("Хайлтын текст хэт урт");
  const context = String(input.assessmentContextId || "");
  const scope = Prisma.sql`q."deletedAt" IS NULL AND (${context} = '' OR q."assessmentContextId" = ${context} OR EXISTS(SELECT 1 FROM topic_question_classification c WHERE c."questionId"=q.id AND c."assessmentContextId"=${context})) ${allowedIds ? Prisma.sql`AND q.id = ANY(${[...allowedIds]}::text[])` : Prisma.empty}`;
  const base = Prisma.sql`WITH bank AS (
    SELECT q.id,q.code,q."createdAt",q."lifecycleStatus",v.id AS "versionId",v.type::text AS type,v."versionStatus"::text AS status,v.title,v.body,
      c."topicId",d.code AS difficulty
    FROM question q JOIN LATERAL (SELECT * FROM question_version WHERE "questionId"=q.id ORDER BY "versionNumber" DESC LIMIT 1) v ON true
    LEFT JOIN LATERAL (SELECT * FROM topic_question_classification WHERE "questionId"=q.id AND ("validatedQuestionVersionId" IS NULL OR "validatedQuestionVersionId"=v.id) AND (${context}='' OR "assessmentContextId"=${context}) ORDER BY "isPrimary" DESC,id LIMIT 1) c ON true
    LEFT JOIN difficulty_level d ON d.id=c."difficultyLevelId" WHERE ${scope}
  )`;
  const filters = Prisma.sql`(${types.length}=0 OR type=ANY(${types}::text[]))
    AND (${statuses.length}=0 OR lower(CASE WHEN "lifecycleStatus"::text='ARCHIVED' THEN 'ARCHIVED' ELSE status END)=ANY(${statuses}::text[]))
    AND (${difficulties.length}=0 OR difficulty=ANY(${difficulties}::text[]))
    AND (${String(input.search || "")}='' OR strpos(lower(concat_ws(' ',code,title,body)),lower(${String(input.search || "")}))>0)
    AND (${topics.length}=0 OR EXISTS(SELECT 1 FROM topic_question_classification c WHERE c."questionId"=bank.id AND (c."validatedQuestionVersionId" IS NULL OR c."validatedQuestionVersionId"=bank."versionId") AND c."topicId"=ANY(${topics}::text[])))
    AND (${audiences.length}=0 OR EXISTS(SELECT 1 FROM topic_question_classification c JOIN assessment_context ac ON ac.id=c."assessmentContextId" WHERE c."questionId"=bank.id AND (c."validatedQuestionVersionId" IS NULL OR c."validatedQuestionVersionId"=bank."versionId") AND ac."audienceLevelId"=ANY(${audiences}::text[])))`;
  return db.$transaction(
    async (tx) => {
      const totalRows = await tx.$queryRaw<any[]>(
        Prisma.sql`${base} SELECT count(*)::int AS total FROM bank WHERE ${filters}`,
      );
      const total = totalRows[0].total,
        actualPage = Math.min(page, Math.max(1, Math.ceil(total / pageSize)));
      const ids = await tx.$queryRaw<any[]>(
        Prisma.sql`${base} SELECT id FROM bank WHERE ${filters} ORDER BY "createdAt" DESC,id DESC LIMIT ${pageSize} OFFSET ${(actualPage - 1) * pageSize}`,
      );
      const facets = await tx.$queryRaw<any[]>(
        Prisma.sql`${base} SELECT type,lower(CASE WHEN "lifecycleStatus"::text='ARCHIVED' THEN 'ARCHIVED' ELSE status END) AS status,difficulty,"topicId",count(*)::int AS count FROM bank GROUP BY type,status,"lifecycleStatus",difficulty,"topicId"`,
      );
      const rows = await tx.question.findMany({
        where: { id: { in: ids.map((x) => x.id) } },
        select: {
          id: true,
          code: true,
          revision: true,
          ownerUserId: true,
          assessmentContextId: true,
          lifecycleStatus: true,
          createdAt: true,
          currentPublishedVersionId: true,
          workflowEvents: { orderBy: { occurredAt: "desc" }, take: 1 },
          classifications: {
            orderBy: [{ isPrimary: "desc" }, { id: "asc" }],
            include: {
              topic: true,
              difficultyLevel: true,
              assessmentContext: true,
            },
          },
          versions: {
            orderBy: { versionNumber: "desc" },
            take: 1,
            select: {
              id: true,
              type: true,
              versionStatus: true,
              title: true,
              body: true,
              versionNumber: true,
              defaultMaxScore: true,
              defaultMinScore: true,
            },
          },
        },
      });
      const items = ids.map(({ id }) => {
        const q = rows.find((row) => row.id === id)!;
        const v = q.versions[0];
        return {
          ...q,
          activeVersion: v,
          classifications: q.classifications.filter(
            (c) =>
              (!c.validatedQuestionVersionId ||
                c.validatedQuestionVersionId === v.id) &&
              (!context || c.assessmentContextId === context),
          ),
        };
      });
      return { items, total, page: actualPage, pageSize, facets };
    },
    { isolationLevel: "RepeatableRead", timeout: 15000 },
  );
}
