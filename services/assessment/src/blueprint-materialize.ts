import { BadRequestException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { assessPools, poolCatalog } from "./blueprint-pools";
import { lockQuestion } from "./question-workflow";
import { Override } from "./blueprint-selection";
export async function materializeBlueprint(
  tx: any,
  templateId: string,
  revisionId: string,
  overrides: Override[] = [],
  seed = randomUUID(),
) {
  await tx.$queryRaw`SELECT id FROM quiz_template WHERE id=${templateId} FOR UPDATE`;
  const b = await tx.quizTemplate.findUnique({
    where: { id: templateId },
    include: {
      sections: {
        orderBy: { orderIndex: "asc" },
        include: { questions: { orderBy: { orderIndex: "asc" } } },
      },
    },
  });
  if (!b) throw new BadRequestException("Blueprint олдсонгүй.");
  const c = await poolCatalog(tx, b.assessmentContextId, b.createdBy);
  let r = assessPools(b, c, seed, overrides);
  if (r.status !== "READY")
    throw new BadRequestException({
      message: "Blueprint ашиглахад бэлэн биш.",
      issues: r.issues,
    });
  const picked = Object.values(r.selected).flat().sort();
  for (const id of picked) await lockQuestion(tx, id);
  // Re-resolve under question locks, then reject any changed membership/version rather than silently changing the chosen set.
  const current = await poolCatalog(tx, b.assessmentContextId, b.createdBy);
  const checked = assessPools(b, current, seed, overrides);
  if (
    checked.status !== "READY" ||
    JSON.stringify(checked.selected) !== JSON.stringify(r.selected)
  )
    throw new BadRequestException(
      "Асуултын сан өөрчлөгдсөн. Дахин сонголт хийнэ үү.",
    );
  r = checked;
  await tx.quizRevisionSection.deleteMany({
    where: { quizRevisionId: revisionId },
  });
  for (let i = 0; i < b.sections.length; i++) {
    const s = b.sections[i],
      rs = r.sections[i];
    const chosen = r.selected[s.id];
    const section = await tx.quizRevisionSection.create({
      data: {
        quizRevisionId: revisionId,
        sourceSectionId: s.id,
        title: s.title,
        description: s.description,
        sectionMode: s.sectionMode,
        orderIndex: i + 1,
        questionCount: s.questionCount,
        maxScorePerQuestion: s.maxScorePerQuestion,
        minScorePerQuestion: 0,
        selectionStrategy: "RANDOM",
        selectionRuleSnapshot: {
          schemaVersion: 1,
          seed,
          blueprintVersion: b.version,
          mode: s.sectionMode,
          rules: s.selectionRules,
          eligibleCount: rs.eligibleCount,
          selected: chosen.map((id) => ({
            questionId: id,
            questionVersionId: rs.candidates.find((q) => q.id === id)!
              .versionId,
          })),
        },
      },
    });
    for (let j = 0; j < chosen.length; j++) {
      const q = rs.candidates.find((q) => q.id === chosen[j])!;
      await tx.quizRevisionQuestion.create({
        data: {
          revisionSectionId: section.id,
          questionId: q.id,
          questionVersionId: q.versionId,
          orderIndex: j + 1,
          maxScore: s.maxScorePerQuestion,
          minScore: 0,
          questionTypeCodeSnapshot: q.type.toLowerCase(),
          topicSnapshot: { topicId: q.topicId },
          difficultySnapshot: { difficultyLevelId: q.difficultyLevelId },
        },
      });
    }
  }
  await tx.quizRevision.update({where:{id:revisionId},data:{totalQuestionCount:r.summary.pickedQuestions,totalMaxScore:r.summary.totalPoints}});
  return { seed, blueprintVersion: b.version };
}
