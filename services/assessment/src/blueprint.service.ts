import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { CreateBlueprintDto, UpdateBlueprintDto } from "./dto/blueprint.dto";

@Injectable()
export class BlueprintService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBlueprintDto) {
    const templateId = await this.prisma.$transaction(async (tx) => {
      // 1. Calculate total score
      const totalScore = dto.sections
        ? dto.sections.reduce(
            (sum, section) => sum + section.randomPickCount * section.pointsPerQuestion,
            0
          )
        : 0;

      const code = dto.code || `template-${Date.now()}`;

      // 2. Create QuizTemplate with required fields
      const template = await tx.quizTemplate.create({
        data: {
          code,
          name: dto.name,
          description: dto.description || null,
          totalMaxScore: totalScore,
          assessmentContextId: dto.assessmentContextId || "context-civil-service", // Default fallback from seed
          defaultDurationMinutes: 60,
          defaultPassingScore: 70.0,
          createdBy: "system_author",
        },
      });

      // 3. Create Sections & SectionQuestions
      if (dto.sections && Array.isArray(dto.sections)) {
        for (let i = 0; i < dto.sections.length; i++) {
          const secDto = dto.sections[i];
          const section = await tx.quizSection.create({
            data: {
              templateId: template.id,
              title: secDto.name,
              questionCount: secDto.randomPickCount,
              maxScorePerQuestion: secDto.pointsPerQuestion,
              orderIndex: i + 1,
              sectionMode: "FIXED",
              selectionStrategy: "RANDOM",
            },
          });

          // Add questions to section
          if (secDto.selectedQuestionIds && Array.isArray(secDto.selectedQuestionIds)) {
            for (let j = 0; j < secDto.selectedQuestionIds.length; j++) {
              await tx.sectionQuestion.create({
                data: {
                  sectionId: section.id,
                  questionId: secDto.selectedQuestionIds[j],
                  orderIndex: j + 1,
                },
              });
            }
          }
        }
      }

      return template.id;
    });

    return this.findOne(templateId);
  }

  async findAll(contextId?: string) {
    return await this.prisma.quizTemplate.findMany({
      where: contextId ? { assessmentContextId: contextId } : undefined,
      include: {
        sections: {
          include: {
            questions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const blueprint = await this.prisma.quizTemplate.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { orderIndex: "asc" },
          include: {
            questions: {
              orderBy: { orderIndex: "asc" },
              include: {
                question: {
                  include: {
                    currentPublishedVersion: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!blueprint) {
      throw new NotFoundException(`Blueprint with ID ${id} not found`);
    }

    return blueprint;
  }

  async update(id: string, dto: UpdateBlueprintDto) {
    await this.findOne(id);

    await this.prisma.$transaction(async (tx) => {
      // 1. Update basic fields
      const totalScore = dto.sections
        ? dto.sections.reduce((sum, s) => sum + s.randomPickCount * s.pointsPerQuestion, 0)
        : undefined;

      await tx.quizTemplate.update({
        where: { id },
        data: {
          code: dto.code,
          name: dto.name,
          description: dto.description,
          totalMaxScore: totalScore,
          assessmentContextId: dto.assessmentContextId,
        },
      });

      // 2. If sections are provided, recreate them
      if (dto.sections) {
        // Clear old sections (cascade will delete sectionQuestion records)
        const oldSections = await tx.quizSection.findMany({
          where: { templateId: id },
        });

        for (const sec of oldSections) {
          await tx.sectionQuestion.deleteMany({
            where: { sectionId: sec.id },
          });
        }

        await tx.quizSection.deleteMany({
          where: { templateId: id },
        });

        // Create new sections
        for (let i = 0; i < dto.sections.length; i++) {
          const secDto = dto.sections[i];
          const section = await tx.quizSection.create({
            data: {
              templateId: id,
              title: secDto.name,
              questionCount: secDto.randomPickCount,
              maxScorePerQuestion: secDto.pointsPerQuestion,
              orderIndex: i + 1,
              sectionMode: "FIXED",
              selectionStrategy: "RANDOM",
            },
          });

          if (secDto.selectedQuestionIds && Array.isArray(secDto.selectedQuestionIds)) {
            for (let j = 0; j < secDto.selectedQuestionIds.length; j++) {
              await tx.sectionQuestion.create({
                data: {
                  sectionId: section.id,
                  questionId: secDto.selectedQuestionIds[j],
                  orderIndex: j + 1,
                },
              });
            }
          }
        }
      }
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    const blueprint = await this.findOne(id);
    return await this.prisma.$transaction(async (tx) => {
      const sections = await tx.quizSection.findMany({
        where: { templateId: id },
      });
      for (const s of sections) {
        await tx.sectionQuestion.deleteMany({ where: { sectionId: s.id } });
      }
      await tx.quizSection.deleteMany({ where: { templateId: id } });
      return await tx.quizTemplate.delete({ where: { id } });
    });
  }
}
