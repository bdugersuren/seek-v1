import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  Req,
  BadRequestException,
} from "@nestjs/common";
import { timingSafeEqual } from "crypto";
import { PrismaService } from "./prisma.service";
@Controller("execution/internal/question-statistics")
export class QuestionStatisticsController {
  constructor(private readonly db: PrismaService) {}
  @Post()
  async read(@Req() req: any, @Body() body: any) {
    const secret = process.env.CANDIDATE_INTERNAL_SECRET;
    const provided = String(req.headers["x-candidate-internal-secret"] || "");
    if (
      !secret ||
      secret.length < 32 ||
      Buffer.byteLength(secret) !== Buffer.byteLength(provided) ||
      !timingSafeEqual(Buffer.from(secret), Buffer.from(provided))
    )
      throw new ForbiddenException();
    const ids = body?.versionIds;
    if (
      !Array.isArray(ids) ||
      ids.length > 100 ||
      ids.some((x) => typeof x !== "string" || !x || x.length > 100)
    )
      throw new BadRequestException();
    const rows = await this.db.$queryRaw<any[]>`
    SELECT q."questionVersionId" AS "versionId",
      count(*) FILTER (WHERE a."startedAt" IS NOT NULL)::int AS "usageCount",
      count(*) FILTER (WHERE g.value->>'score' IS NOT NULL AND (a."runtimePolicySnapshot"->'result'->>'status')='GRADED')::int AS "gradedCount",
      count(*) FILTER (WHERE g.value->>'score' IS NOT NULL AND (a."runtimePolicySnapshot"->'result'->>'status')='GRADED' AND (g.value->>'score')::numeric >= (g.value->>'maxScore')::numeric AND (g.value->>'maxScore')::numeric>0)::int AS "correctCount",
      avg((g.value->>'score')::numeric / NULLIF((g.value->>'maxScore')::numeric,0)*100) FILTER (WHERE (a."runtimePolicySnapshot"->'result'->>'status')='GRADED')::float AS "averagePercentage"
    FROM attempt_question q JOIN quiz_attempt a ON a.id=q."attemptId"
    LEFT JOIN LATERAL jsonb_array_elements(COALESCE(a."runtimePolicySnapshot"->'result'->'grades','[]'::jsonb)) g(value) ON g.value->>'questionId'=q."questionId"
    WHERE q."questionVersionId" = ANY(${ids}::text[])
    GROUP BY q."questionVersionId"`;
    return {
      schemaVersion: 1,
      asOf: new Date().toISOString(),
      items: ids.map(
        (versionId) =>
          rows.find((r) => r.versionId === versionId) || {
            versionId,
            usageCount: 0,
            gradedCount: 0,
            correctCount: 0,
            averagePercentage: null,
          },
      ),
    };
  }
}
