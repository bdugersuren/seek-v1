import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { CreateQuestionDto, UpdateQuestionDto } from "./dto/question.dto";
import { Prisma } from "../generated/prisma-client";

@Injectable()
export class QuestionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateQuestionDto) {
    if (!dto.code || !dto.body || !dto.type) {
      throw new BadRequestException("code, body and type are required");
    }

    // Check unique code
    const existing = await this.prisma.question.findUnique({
      where: { code: dto.code },
    });
    if (existing) {
      throw new BadRequestException(`Question with code ${dto.code} already exists`);
    }

    return await this.prisma.$transaction(async (tx) => {
      // 1. Create parent Question
      const question = await tx.question.create({
        data: {
          code: dto.code,
          lifecycleStatus: dto.lifecycleStatus || "ACTIVE",
          visibilityScope: dto.visibilityScope || "PRIVATE",
          ownerUserId: dto.ownerUserId || null,
          createdBy: dto.ownerUserId || "system_author",
          version: 1,
        },
      });

      // 2. Create version 1 (DRAFT)
      const questionVersion = await tx.questionVersion.create({
        data: {
          questionId: question.id,
          versionNumber: 1,
          versionStatus: "DRAFT",
          type: dto.type,
          title: dto.title || null,
          body: dto.body,
          defaultTimeSeconds: dto.defaultTimeSeconds || null,
          defaultMaxScore: dto.defaultMaxScore || 1,
          defaultMinScore: dto.defaultMinScore || 0,
          languageCode: dto.languageCode || "mn",
          tags: dto.tags || [],
          explanation: dto.explanation || null,
          payload: dto.payload || {},
          answerConfig: dto.answerConfig || {},
          scoringConfig: dto.scoringConfig || {},
          createdBy: "system_author",
        },
      });

      // 3. If options exist in payload (e.g. multiple_choice, single_choice options)
      if (dto.payload?.options && Array.isArray(dto.payload.options)) {
        for (let i = 0; i < dto.payload.options.length; i++) {
          const option = dto.payload.options[i];
          await tx.questionOptionVersion.create({
            data: {
              questionVersionId: questionVersion.id,
              optionKey: option.code || option.optionKey || `opt_${i + 1}`,
              value: option.body || option.value || "",
              isCorrect: option.isCorrect || false,
              orderIndex: i + 1,
              score: option.score || option.scoreWeight || 1.0,
              matchRules: option.matchRules || {},
            },
          });
        }
      }

      // 4. Create Media Attachments if exist
      if (dto.media && Array.isArray(dto.media)) {
        for (let i = 0; i < dto.media.length; i++) {
          const med = dto.media[i];
          await tx.questionMedia.create({
            data: {
              questionVersionId: questionVersion.id,
              mediaType: med.mediaType || "IMAGE",
              storageKey: med.storageKey,
              mimeType: med.mimeType || null,
              sizeBytes: med.sizeBytes ? BigInt(med.sizeBytes) : null,
              orderIndex: med.orderIndex || (i + 1),
              metadata: med.metadata || {},
            },
          });
        }
      }

      return {
        ...question,
        versions: [questionVersion],
      };
    });
  }

  async findAll(filters: { status?: string; type?: string; search?: string; ownerUserId?: string }) {
    const whereClause: any = {
      deletedAt: null,
    };

    if (filters.status) {
      whereClause.lifecycleStatus = filters.status;
    }

    if (filters.ownerUserId) {
      whereClause.OR = [
        { ownerUserId: filters.ownerUserId },
        { visibilityScope: "TENANT" } // share to other assessors
      ];
    }

    const questions = await this.prisma.question.findMany({
      where: whereClause,
      include: {
        currentPublishedVersion: {
          include: {
            options: true,
            media: true,
          },
        },
        versions: {
          orderBy: { versionNumber: "desc" },
          take: 1,
          include: {
            options: true,
            media: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return questions.map((q) => {
      const activeVersion = q.currentPublishedVersion || q.versions[0];
      return {
        id: q.id,
        code: q.code,
        lifecycleStatus: q.lifecycleStatus,
        visibilityScope: q.visibilityScope,
        version: q.version,
        createdAt: q.createdAt,
        activeVersion: activeVersion || null,
      };
    });
  }

  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: { versionNumber: "desc" },
          include: {
            options: true,
            media: true,
          },
        },
        currentPublishedVersion: {
          include: {
            options: true,
            media: true,
          },
        },
      },
    });

    if (!question || question.deletedAt) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return question;
  }

  async update(id: string, dto: UpdateQuestionDto) {
    const question = await this.findOne(id);
    const lastVersion = question.versions[0];

    if (!lastVersion) {
      throw new BadRequestException("No version history found for this question");
    }

    return await this.prisma.$transaction(async (tx) => {
      // A. If latest version is in DRAFT, edit it directly
      if (lastVersion.versionStatus === "DRAFT") {
        const updatedVersion = await tx.questionVersion.update({
          where: { id: lastVersion.id },
          data: {
            title: dto.title !== undefined ? dto.title : lastVersion.title,
            body: dto.body !== undefined ? dto.body : lastVersion.body,
            type: dto.type !== undefined ? dto.type : lastVersion.type,
            defaultTimeSeconds: dto.defaultTimeSeconds !== undefined ? dto.defaultTimeSeconds : lastVersion.defaultTimeSeconds,
            defaultMaxScore: dto.defaultMaxScore !== undefined ? dto.defaultMaxScore : lastVersion.defaultMaxScore,
            defaultMinScore: dto.defaultMinScore !== undefined ? dto.defaultMinScore : lastVersion.defaultMinScore,
            languageCode: dto.languageCode !== undefined ? dto.languageCode : lastVersion.languageCode,
            tags: dto.tags !== undefined ? dto.tags : lastVersion.tags,
            explanation: dto.explanation !== undefined ? dto.explanation : lastVersion.explanation,
            payload: dto.payload !== undefined ? dto.payload : lastVersion.payload,
            answerConfig: dto.answerConfig !== undefined ? dto.answerConfig : lastVersion.answerConfig,
            scoringConfig: dto.scoringConfig !== undefined ? dto.scoringConfig : lastVersion.scoringConfig,
          },
        });

        // Recreate options if payload is updated and contains options
        if (dto.payload?.options && Array.isArray(dto.payload.options)) {
          await tx.questionOptionVersion.deleteMany({
            where: { questionVersionId: lastVersion.id },
          });

          for (let i = 0; i < dto.payload.options.length; i++) {
            const option = dto.payload.options[i];
            await tx.questionOptionVersion.create({
              data: {
                questionVersionId: lastVersion.id,
                optionKey: option.code || option.optionKey || `opt_${i + 1}`,
                value: option.body || option.value || "",
                isCorrect: option.isCorrect || false,
                orderIndex: i + 1,
                score: option.score || option.scoreWeight || 1.0,
                matchRules: option.matchRules || {},
              },
            });
          }
        }

        // Recreate media if updated
        if (dto.media && Array.isArray(dto.media)) {
          await tx.questionMedia.deleteMany({
            where: { questionVersionId: lastVersion.id },
          });

          for (let i = 0; i < dto.media.length; i++) {
            const med = dto.media[i];
            await tx.questionMedia.create({
              data: {
                questionVersionId: lastVersion.id,
                mediaType: med.mediaType || "IMAGE",
                storageKey: med.storageKey,
                mimeType: med.mimeType || null,
                sizeBytes: med.sizeBytes ? BigInt(med.sizeBytes) : null,
                orderIndex: med.orderIndex || (i + 1),
                metadata: med.metadata || {},
              },
            });
          }
        }

        return {
          id: question.id,
          code: question.code,
          version: question.version,
          activeVersion: updatedVersion,
        };
      }

      // B. If latest version is APPROVED or PUBLISHED, create a new version as DRAFT
      const nextVersionNumber = lastVersion.versionNumber + 1;
      const newVersion = await tx.questionVersion.create({
        data: {
          questionId: question.id,
          versionNumber: nextVersionNumber,
          versionStatus: "DRAFT",
          type: dto.type !== undefined ? dto.type : lastVersion.type,
          title: dto.title !== undefined ? dto.title : lastVersion.title,
          body: dto.body !== undefined ? dto.body : lastVersion.body,
          defaultTimeSeconds: dto.defaultTimeSeconds !== undefined ? dto.defaultTimeSeconds : lastVersion.defaultTimeSeconds,
          defaultMaxScore: dto.defaultMaxScore !== undefined ? dto.defaultMaxScore : lastVersion.defaultMaxScore,
          defaultMinScore: dto.defaultMinScore !== undefined ? dto.defaultMinScore : lastVersion.defaultMinScore,
          languageCode: dto.languageCode !== undefined ? dto.languageCode : lastVersion.languageCode,
          tags: dto.tags !== undefined ? dto.tags : lastVersion.tags,
          explanation: dto.explanation !== undefined ? dto.explanation : lastVersion.explanation,
          payload: dto.payload !== undefined ? dto.payload : lastVersion.payload,
          answerConfig: dto.answerConfig !== undefined ? dto.answerConfig : lastVersion.answerConfig,
          scoringConfig: dto.scoringConfig !== undefined ? dto.scoringConfig : lastVersion.scoringConfig,
          createdBy: "system_author",
        },
      });

      // Populate options for new version from incoming DTO or fallback to previous options
      const optionsSource = (dto.payload?.options && Array.isArray(dto.payload.options))
        ? dto.payload.options
        : lastVersion.options;

      if (optionsSource && Array.isArray(optionsSource)) {
        for (let i = 0; i < optionsSource.length; i++) {
          const option = optionsSource[i];
          await tx.questionOptionVersion.create({
            data: {
              questionVersionId: newVersion.id,
              optionKey: option.optionKey || option.code || `opt_${i + 1}`,
              value: option.value || option.body || "",
              isCorrect: option.isCorrect || false,
              orderIndex: i + 1,
              score: option.score || option.scoreWeight || 1.0,
              matchRules: option.matchRules || {},
            },
          });
        }
      }

      // Populate media for new version
      const mediaSource = (dto.media && Array.isArray(dto.media))
        ? dto.media
        : lastVersion.media;

      if (mediaSource && Array.isArray(mediaSource)) {
        for (let i = 0; i < mediaSource.length; i++) {
          const med = mediaSource[i];
          await tx.questionMedia.create({
            data: {
              questionVersionId: newVersion.id,
              mediaType: med.mediaType || "IMAGE",
              storageKey: med.storageKey,
              mimeType: med.mimeType || null,
              sizeBytes: med.sizeBytes ? BigInt(med.sizeBytes) : null,
              orderIndex: med.orderIndex || (i + 1),
              metadata: med.metadata || {},
            },
          });
        }
      }

      // Update parent version counter
      await tx.question.update({
        where: { id: question.id },
        data: { version: nextVersionNumber },
      });

      return {
        id: question.id,
        code: question.code,
        version: nextVersionNumber,
        activeVersion: newVersion,
      };
    });
  }

  async remove(id: string) {
    const question = await this.findOne(id);
    return await this.prisma.question.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: "system_author",
        lifecycleStatus: "ARCHIVED",
      },
    });
  }

  async getTopics() {
    return await this.prisma.topic.findMany({
      orderBy: { path: "asc" },
    });
  }

  async getDifficultyLevels() {
    return await this.prisma.difficultyLevel.findMany({
      orderBy: { rank: "asc" },
    });
  }

  async getCognitiveLevels() {
    return await this.prisma.cognitiveLevel.findMany({
      orderBy: { rank: "asc" },
    });
  }

  // Topics CRUD
  async createTopic(dto: { title: string; parentId?: string; code?: string; path?: string }) {
    const code = dto.code || `TOPIC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const path = dto.path || code.toLowerCase();
    const context = await this.prisma.assessmentContext.findFirst();
    const assessmentContextId = context?.id || null;

    return await this.prisma.topic.create({
      data: {
        code,
        title: dto.title,
        parentId: dto.parentId || null,
        path,
        assessmentContextId,
      },
    });
  }

  async updateTopic(id: string, dto: { title?: string; parentId?: string; path?: string; isActive?: boolean }) {
    return await this.prisma.topic.update({
      where: { id },
      data: {
        title: dto.title,
        parentId: dto.parentId !== undefined ? dto.parentId : undefined,
        path: dto.path,
        isActive: dto.isActive,
      },
    });
  }

  async deleteTopic(id: string) {
    return await this.prisma.topic.delete({
      where: { id },
    });
  }

  // Difficulty Levels CRUD
  async createDifficultyLevel(dto: { name: string; code?: string; rank: number }) {
    const code = dto.code || `DIFF-${dto.name.toUpperCase().replace(/[^A-Z0-9-]/g, "-")}`;
    const scale = await this.prisma.difficultyScale.findFirst();
    if (!scale) {
      throw new BadRequestException("No difficulty scale found in DB");
    }
    return await this.prisma.difficultyLevel.create({
      data: {
        difficultyScaleId: scale.id,
        code,
        name: dto.name,
        rank: Number(dto.rank),
      },
    });
  }

  async updateDifficultyLevel(id: string, dto: { name?: string; rank?: number; isActive?: boolean }) {
    return await this.prisma.difficultyLevel.update({
      where: { id },
      data: {
        name: dto.name,
        rank: dto.rank !== undefined ? Number(dto.rank) : undefined,
        isActive: dto.isActive,
      },
    });
  }

  async deleteDifficultyLevel(id: string) {
    return await this.prisma.difficultyLevel.delete({
      where: { id },
    });
  }

  // Cognitive Levels CRUD
  async createCognitiveLevel(dto: { name: string; code?: string; rank: number }) {
    const code = dto.code || `COG-${dto.name.toUpperCase().replace(/[^A-Z0-9-]/g, "-")}`;
    const framework = await this.prisma.cognitiveFramework.findFirst();
    if (!framework) {
      throw new BadRequestException("No cognitive framework found in DB");
    }
    return await this.prisma.cognitiveLevel.create({
      data: {
        cognitiveFrameworkId: framework.id,
        code,
        name: dto.name,
        rank: Number(dto.rank),
      },
    });
  }

  async updateCognitiveLevel(id: string, dto: { name?: string; rank?: number; isActive?: boolean }) {
    return await this.prisma.cognitiveLevel.update({
      where: { id },
      data: {
        name: dto.name,
        rank: dto.rank !== undefined ? Number(dto.rank) : undefined,
        isActive: dto.isActive,
      },
    });
  }

  async deleteCognitiveLevel(id: string) {
    return await this.prisma.cognitiveLevel.delete({
      where: { id },
    });
  }

  // AssessmentContext CRUD
  async getAssessmentContexts() {
    return await this.prisma.assessmentContext.findMany({
      include: {
        audienceType: true,
        audienceLevel: true,
        difficultyScale: true,
        cognitiveFramework: true,
        competenceFramework: true,
      },
    });
  }

  async createAssessmentContext(dto: {
    name: string;
    code?: string;
    audienceTypeId?: string;
    difficultyScaleId?: string;
    cognitiveFrameworkId?: string;
    competenceFrameworkId?: string;
  }) {
    const code = dto.code || `AC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const audType = dto.audienceTypeId || (await this.prisma.audienceType.findFirst())?.id;
    const diffScale = dto.difficultyScaleId || (await this.prisma.difficultyScale.findFirst())?.id;
    const cogFrame = dto.cognitiveFrameworkId || (await this.prisma.cognitiveFramework.findFirst())?.id;
    const compFrame = dto.competenceFrameworkId || (await this.prisma.competenceFramework.findFirst())?.id;

    if (!audType || !diffScale || !cogFrame || !compFrame) {
      throw new BadRequestException("Missing required referenced framework scale or audience metadata");
    }

    return await this.prisma.assessmentContext.create({
      data: {
        code,
        name: dto.name,
        audienceTypeId: audType,
        difficultyScaleId: diffScale,
        cognitiveFrameworkId: cogFrame,
        competenceFrameworkId: compFrame,
      },
    });
  }

  async updateAssessmentContext(id: string, dto: { name?: string; isActive?: boolean }) {
    return await this.prisma.assessmentContext.update({
      where: { id },
      data: {
        name: dto.name,
        isActive: dto.isActive,
      },
    });
  }

  async deleteAssessmentContext(id: string) {
    return await this.prisma.assessmentContext.delete({
      where: { id },
    });
  }

  // DifficultyScale CRUD
  async getDifficultyScales() {
    return await this.prisma.difficultyScale.findMany();
  }

  async createDifficultyScale(dto: { name: string; code?: string }) {
    const code = dto.code || `SCALE-${dto.name.toUpperCase().replace(/[^A-Z0-9-]/g, "-")}`;
    return await this.prisma.difficultyScale.create({
      data: {
        code,
        name: dto.name,
      },
    });
  }

  async updateDifficultyScale(id: string, dto: { name?: string; isActive?: boolean }) {
    return await this.prisma.difficultyScale.update({
      where: { id },
      data: {
        name: dto.name,
        isActive: dto.isActive,
      },
    });
  }

  async deleteDifficultyScale(id: string) {
    return await this.prisma.difficultyScale.delete({
      where: { id },
    });
  }

  // CompetenceFramework CRUD
  async getCompetenceFrameworks() {
    return await this.prisma.competenceFramework.findMany({
      include: { competences: true },
    });
  }

  async createCompetenceFramework(dto: { name: string; code?: string; version?: string }) {
    const code = dto.code || `CF-${dto.name.toUpperCase().replace(/[^A-Z0-9-]/g, "-")}`;
    const version = dto.version || "1.0";
    return await this.prisma.competenceFramework.create({
      data: {
        code,
        name: dto.name,
        version,
      },
    });
  }

  async updateCompetenceFramework(id: string, dto: { name?: string; isActive?: boolean }) {
    return await this.prisma.competenceFramework.update({
      where: { id },
      data: {
        name: dto.name,
        isActive: dto.isActive,
      },
    });
  }

  async deleteCompetenceFramework(id: string) {
    return await this.prisma.competenceFramework.delete({
      where: { id },
    });
  }

  // CompetenceType CRUD
  async getCompetenceTypes() {
    return await this.prisma.competenceType.findMany();
  }

  async createCompetenceType(dto: { competenceFrameworkId: string; name: string; code?: string }) {
    const code = dto.code || `CT-${dto.name.toUpperCase().replace(/[^A-Z0-9-]/g, "-")}`;
    return await this.prisma.competenceType.create({
      data: {
        competenceFrameworkId: dto.competenceFrameworkId,
        code,
        name: dto.name,
      },
    });
  }

  async updateCompetenceType(id: string, dto: { name?: string; isActive?: boolean }) {
    return await this.prisma.competenceType.update({
      where: { id },
      data: {
        name: dto.name,
        isActive: dto.isActive,
      },
    });
  }

  async deleteCompetenceType(id: string) {
    return await this.prisma.competenceType.delete({
      where: { id },
    });
  }

  // AudienceLevel CRUD
  async getAudienceLevels() {
    return await this.prisma.audienceLevel.findMany();
  }

  async createAudienceLevel(dto: { name: string; code?: string; rank?: number; audienceTypeId?: string }) {
    const code = dto.code || `AL-${dto.name.toUpperCase().replace(/[^A-Z0-9-]/g, "-")}`;
    const audType = dto.audienceTypeId || (await this.prisma.audienceType.findFirst())?.id;
    if (!audType) {
      throw new BadRequestException("No audience type found in DB to associate with level");
    }
    return await this.prisma.audienceLevel.create({
      data: {
        code,
        name: dto.name,
        orderIndex: dto.rank || 1,
        audienceTypeId: audType,
      },
    });
  }

  async updateAudienceLevel(id: string, dto: { name?: string; rank?: number; isActive?: boolean }) {
    return await this.prisma.audienceLevel.update({
      where: { id },
      data: {
        name: dto.name,
        orderIndex: dto.rank !== undefined ? Number(dto.rank) : undefined,
        isActive: dto.isActive,
      },
    });
  }

  async deleteAudienceLevel(id: string) {
    return await this.prisma.audienceLevel.delete({
      where: { id },
    });
  }

  // AudienceType CRUD
  async getAudienceTypes() {
    return await this.prisma.audienceType.findMany();
  }

  async createAudienceType(dto: { name: string; code?: string }) {
    const code = dto.code || `AT-${dto.name.toUpperCase().replace(/[^A-Z0-9-]/g, "-")}`;
    return await this.prisma.audienceType.create({
      data: {
        code,
        name: dto.name,
      },
    });
  }

  async updateAudienceType(id: string, dto: { name?: string; isActive?: boolean }) {
    return await this.prisma.audienceType.update({
      where: { id },
      data: {
        name: dto.name,
        isActive: dto.isActive,
      },
    });
  }

  async deleteAudienceType(id: string) {
    return await this.prisma.audienceType.delete({
      where: { id },
    });
  }

  // Dynamic Database Explorer
  async getDbTables() {
    return Prisma.dmmf.datamodel.models;
  }

  async getDbData(modelName: string) {
    const prismaModel = this.getPrismaModel(modelName);
    return await prismaModel.findMany({
      take: 200,
    });
  }

  async createDbData(modelName: string, data: any) {
    const prismaModel = this.getPrismaModel(modelName);
    return await prismaModel.create({
      data,
    });
  }

  async updateDbData(modelName: string, id: string, data: any) {
    const prismaModel = this.getPrismaModel(modelName);
    return await prismaModel.update({
      where: { id },
      data,
    });
  }

  async deleteDbData(modelName: string, id: string) {
    const prismaModel = this.getPrismaModel(modelName);
    return await prismaModel.delete({
      where: { id },
    });
  }

  private getPrismaModel(modelName: string) {
    const target = modelName.charAt(0).toLowerCase() + modelName.slice(1);
    const prismaModel = (this.prisma as any)[target];
    if (!prismaModel) {
      throw new NotFoundException(`Model ${modelName} not found in Prisma client`);
    }
    return prismaModel;
  }
}

