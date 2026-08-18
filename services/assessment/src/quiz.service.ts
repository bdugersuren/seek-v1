import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { CreateQuizDto, UpdateQuizDto } from "./dto/quiz.dto";

@Injectable()
export class QuizService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateQuizDto) {
    if (!dto.title || !dto.blueprintId || !dto.durationMinutes) {
      throw new BadRequestException("title, blueprintId and durationMinutes are required");
    }

    const blueprint = await this.prisma.quizTemplate.findUnique({
      where: { id: dto.blueprintId },
      include: {
        sections: {
          include: {
            questions: {
              include: {
                question: {
                  include: {
                    currentPublishedVersion: true,
                    versions: {
                      orderBy: { versionNumber: "desc" },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!blueprint) {
      throw new NotFoundException(`Blueprint with ID ${dto.blueprintId} not found`);
    }

    return await this.prisma.$transaction(async (tx) => {
      const code = `quiz-${dto.blueprintId}-${Date.now()}`;

      // 1. Create parent Quiz
      const quiz = await tx.quiz.create({
        data: {
          templateId: dto.blueprintId,
          code,
          title: dto.title,
          createdBy: "system_author",
          version: 1,
        },
      });

      // 2. Create QuizRevision v1
      const revision = await tx.quizRevision.create({
        data: {
          quizId: quiz.id,
          revisionNumber: 1,
          revisionStatus: "DRAFT",
          assessmentContextId: "context-civil-service", // Default fallback context from seed
          title: dto.title,
          description: dto.description || null,
          durationMinutes: dto.durationMinutes,
          passingScore: 70.0, // Default passing threshold
          maxAttempts: dto.maxAttempts || 1,
          paymentRequired: (dto.priceMnt || 0) > 0,
          defaultPrice: dto.priceMnt || 0,
          currencyCode: "MNT",
          createdBy: "system_author",
          runtimePolicy: {
            questionOverrides: dto.questionOverrides || [],
          } as any,
        },
      });

      // 3. Process sections & random question pick selection based on overrides
      for (const section of blueprint.sections) {
        const revSection = await tx.quizRevisionSection.create({
          data: {
            quizRevisionId: revision.id,
            sourceSectionId: section.id,
            title: section.title,
            sectionMode: "FIXED",
            orderIndex: section.orderIndex,
            questionCount: section.questionCount,
            maxScorePerQuestion: section.maxScorePerQuestion,
            selectionStrategy: "RANDOM",
          },
        });

        // Resolve question list with overrides
        const mandatoryIds = (dto.questionOverrides || [])
          .filter((ov) => ov.mode === "mandatory")
          .map((ov) => ov.questionId);
        const excludedIds = new Set(
          (dto.questionOverrides || [])
            .filter((ov) => ov.mode === "excluded")
            .map((ov) => ov.questionId)
        );

        const candidates = section.questions.filter(
          (q) => !mandatoryIds.includes(q.questionId) && !excludedIds.has(q.questionId)
        );

        const chosenQuestions = [
          ...section.questions.filter((q) => mandatoryIds.includes(q.questionId)),
          ...candidates,
        ].slice(0, section.questionCount);

        for (let i = 0; i < chosenQuestions.length; i++) {
          const cq = chosenQuestions[i];
          const activeVersion = cq.question.currentPublishedVersion || cq.question.versions[0];
          if (!activeVersion) continue;

          await tx.quizRevisionQuestion.create({
            data: {
              revisionSectionId: revSection.id,
              questionId: cq.questionId,
              questionVersionId: activeVersion.id,
              orderIndex: i + 1,
              maxScore: section.maxScorePerQuestion,
              minScore: 0.0,
            },
          });
        }
      }

      return this.findOne(quiz.id);
    });
  }

  async findAll(contextId?: string) {
    return await this.prisma.quiz.findMany({
      where: contextId
        ? {
            template: {
              assessmentContextId: contextId,
            },
          }
        : undefined,
      include: {
        revisions: {
          orderBy: { revisionNumber: "desc" },
          take: 1,
        },
        currentPublishedRevision: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        revisions: {
          orderBy: { revisionNumber: "desc" },
          include: {
            sections: {
              orderBy: { orderIndex: "asc" },
              include: {
                questions: {
                  orderBy: { orderIndex: "asc" },
                  include: {
                    question: true,
                    questionVersion: {
                      include: {
                        options: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        currentPublishedRevision: true,
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    return quiz;
  }

  async update(id: string, dto: UpdateQuizDto) {
    const quiz = await this.findOne(id);
    const lastRevision = quiz.revisions[0];

    if (!lastRevision) {
      throw new BadRequestException("No revision history found for this quiz");
    }

    return await this.prisma.$transaction(async (tx) => {
      // A. If latest revision is DRAFT, edit it directly
      if (lastRevision.revisionStatus === "DRAFT") {
        await tx.quizRevision.update({
          where: { id: lastRevision.id },
          data: {
            title: dto.title !== undefined ? dto.title : lastRevision.title,
            description: dto.description !== undefined ? dto.description : lastRevision.description,
            durationMinutes: dto.durationMinutes !== undefined ? dto.durationMinutes : lastRevision.durationMinutes,
            maxAttempts: dto.maxAttempts !== undefined ? dto.maxAttempts : lastRevision.maxAttempts,
            paymentRequired: dto.priceMnt !== undefined ? dto.priceMnt > 0 : lastRevision.paymentRequired,
            defaultPrice: dto.priceMnt !== undefined ? dto.priceMnt : lastRevision.defaultPrice,
            runtimePolicy: {
              questionOverrides: dto.questionOverrides !== undefined ? dto.questionOverrides : (lastRevision.runtimePolicy as any)?.questionOverrides || [],
            } as any,
          },
        });

        // Reprocess questions for sections if overrides changed
        if (dto.questionOverrides !== undefined) {
          const blueprint = await tx.quizTemplate.findUnique({
            where: { id: quiz.templateId },
            include: {
              sections: {
                include: {
                  questions: {
                    include: {
                      question: {
                        include: {
                          currentPublishedVersion: true,
                          versions: { orderBy: { versionNumber: "desc" }, take: 1 },
                        },
                      },
                    },
                  },
                },
              },
            },
          });

          if (blueprint) {
            for (const section of blueprint.sections) {
              const revSection = await tx.quizRevisionSection.findFirst({
                where: { quizRevisionId: lastRevision.id, sourceSectionId: section.id },
              });

              if (revSection) {
                await tx.quizRevisionQuestion.deleteMany({
                  where: { revisionSectionId: revSection.id },
                });

                const mandatoryIds = (dto.questionOverrides || [])
                  .filter((ov) => ov.mode === "mandatory")
                  .map((ov) => ov.questionId);
                const excludedIds = new Set(
                  (dto.questionOverrides || [])
                    .filter((ov) => ov.mode === "excluded")
                    .map((ov) => ov.questionId)
                );

                const candidates = section.questions.filter(
                  (q) => !mandatoryIds.includes(q.questionId) && !excludedIds.has(q.questionId)
                );

                const chosenQuestions = [
                  ...section.questions.filter((q) => mandatoryIds.includes(q.questionId)),
                  ...candidates,
                ].slice(0, section.questionCount);

                for (let i = 0; i < chosenQuestions.length; i++) {
                  const cq = chosenQuestions[i];
                  const activeVersion = cq.question.currentPublishedVersion || cq.question.versions[0];
                  if (!activeVersion) continue;

                  await tx.quizRevisionQuestion.create({
                    data: {
                      revisionSectionId: revSection.id,
                      questionId: cq.questionId,
                      questionVersionId: activeVersion.id,
                      orderIndex: i + 1,
                      maxScore: section.maxScorePerQuestion,
                      minScore: 0.0,
                    },
                  });
                }
              }
            }
          }
        }

        return this.findOne(id);
      }

      // B. If latest revision is PUBLISHED/APPROVED, create a new revision as DRAFT
      const nextRevNumber = lastRevision.revisionNumber + 1;
      const newRevision = await tx.quizRevision.create({
        data: {
          quizId: quiz.id,
          revisionNumber: nextRevNumber,
          revisionStatus: "DRAFT",
          assessmentContextId: lastRevision.assessmentContextId,
          title: dto.title !== undefined ? dto.title : lastRevision.title,
          description: dto.description !== undefined ? dto.description : lastRevision.description,
          durationMinutes: dto.durationMinutes !== undefined ? dto.durationMinutes : lastRevision.durationMinutes,
          passingScore: lastRevision.passingScore,
          maxAttempts: dto.maxAttempts !== undefined ? dto.maxAttempts : lastRevision.maxAttempts,
          paymentRequired: dto.priceMnt !== undefined ? dto.priceMnt > 0 : lastRevision.paymentRequired,
          defaultPrice: dto.priceMnt !== undefined ? dto.priceMnt : lastRevision.defaultPrice,
          currencyCode: lastRevision.currencyCode,
          createdBy: "system_author",
          runtimePolicy: {
            questionOverrides: dto.questionOverrides !== undefined ? dto.questionOverrides : (lastRevision.runtimePolicy as any)?.questionOverrides || [],
          } as any,
        },
      });

      // Populate sections and questions for the new revision
      const blueprint = await tx.quizTemplate.findUnique({
        where: { id: quiz.templateId },
        include: {
          sections: {
            include: {
              questions: {
                include: {
                  question: {
                    include: {
                      currentPublishedVersion: true,
                      versions: { orderBy: { versionNumber: "desc" }, take: 1 },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (blueprint) {
        const overridesSource = dto.questionOverrides !== undefined ? dto.questionOverrides : (lastRevision.runtimePolicy as any)?.questionOverrides || [];
        for (const section of blueprint.sections) {
          const revSection = await tx.quizRevisionSection.create({
            data: {
              quizRevisionId: newRevision.id,
              sourceSectionId: section.id,
              title: section.title,
              sectionMode: "FIXED",
              orderIndex: section.orderIndex,
              questionCount: section.questionCount,
              maxScorePerQuestion: section.maxScorePerQuestion,
              selectionStrategy: "RANDOM",
            },
          });

          const mandatoryIds = overridesSource
            .filter((ov: any) => ov.mode === "mandatory")
            .map((ov: any) => ov.questionId);
          const excludedIds = new Set(
            overridesSource
              .filter((ov: any) => ov.mode === "excluded")
              .map((ov: any) => ov.questionId)
          );

          const candidates = section.questions.filter(
            (q) => !mandatoryIds.includes(q.questionId) && !excludedIds.has(q.questionId)
          );

          const chosenQuestions = [
            ...section.questions.filter((q) => mandatoryIds.includes(q.questionId)),
            ...candidates,
          ].slice(0, section.questionCount);

          for (let i = 0; i < chosenQuestions.length; i++) {
            const cq = chosenQuestions[i];
            const activeVersion = cq.question.currentPublishedVersion || cq.question.versions[0];
            if (!activeVersion) continue;

            await tx.quizRevisionQuestion.create({
              data: {
                revisionSectionId: revSection.id,
                questionId: cq.questionId,
                questionVersionId: activeVersion.id,
                orderIndex: i + 1,
                maxScore: section.maxScorePerQuestion,
                minScore: 0.0,
              },
            });
          }
        }
      }

      // Update parent quiz revision count
      await tx.quiz.update({
        where: { id: quiz.id },
        data: { version: nextRevNumber },
      });

      return this.findOne(id);
    });
  }

  async remove(id: string) {
    const quiz = await this.findOne(id);
    return await this.prisma.quiz.update({
      where: { id },
      data: {
        lifecycleStatus: "ARCHIVED" as any,
        archivedAt: new Date(),
      },
    });
  }
}
