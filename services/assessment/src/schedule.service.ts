import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { CreateScheduleDto, UpdateScheduleDto } from "./dto/schedule.dto";
import * as amqp from "amqplib";
import * as crypto from "crypto";

@Injectable()
export class ScheduleService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject("RABBITMQ_CHANNEL")
    private readonly channel: amqp.Channel | null
  ) {}

  private hashAccessCode(code: string): string {
    return crypto.createHash("sha256").update(code).digest("hex");
  }

  async create(dto: CreateScheduleDto) {
    if (!dto.name || !dto.quizRevisionId || !dto.code || !dto.availableFrom || !dto.availableUntil) {
      throw new BadRequestException("name, quizRevisionId, code, availableFrom, and availableUntil are required");
    }

    const revision = await this.prisma.quizRevision.findUnique({
      where: { id: dto.quizRevisionId },
    });
    if (!revision) {
      throw new NotFoundException(`QuizRevision with ID ${dto.quizRevisionId} not found`);
    }

    const existing = await this.prisma.quizSchedule.findUnique({
      where: { code: dto.code },
    });
    if (existing) {
      throw new BadRequestException(`Schedule with code ${dto.code} already exists`);
    }

    const accessCodeHash = dto.accessCode ? this.hashAccessCode(dto.accessCode) : null;

    return await this.prisma.quizSchedule.create({
      data: {
        quizRevisionId: dto.quizRevisionId,
        code: dto.code,
        name: dto.name,
        availableFrom: new Date(dto.availableFrom),
        availableUntil: new Date(dto.availableUntil),
        waitingRoomOpensAt: dto.waitingRoomOpensAt ? new Date(dto.waitingRoomOpensAt) : null,
        requiredEarlyJoinMinutes: dto.requiredEarlyJoinMinutes || 0,
        accessMode: dto.accessMode || "ASSIGNED_ONLY",
        accessCodeHash,
        capacity: dto.capacity || null,
        priceOverride: dto.priceOverride || null,
        autosaveIntervalSeconds: dto.autosaveIntervalSeconds || 10,
        heartbeatIntervalSeconds: dto.heartbeatIntervalSeconds || 15,
        shuffleQuestionsOverride: dto.shuffleQuestionsOverride !== undefined ? dto.shuffleQuestionsOverride : null,
        shuffleOptionsOverride: dto.shuffleOptionsOverride !== undefined ? dto.shuffleOptionsOverride : null,
        createdBy: "system_author",
        status: "DRAFT",
      },
    });
  }

  async findAll() {
    return await this.prisma.quizSchedule.findMany({
      include: {
        quizRevision: {
          include: {
            quiz: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const schedule = await this.prisma.quizSchedule.findUnique({
      where: { id },
      include: {
        quizRevision: {
          include: {
            quiz: true,
            sections: {
              include: {
                questions: {
                  include: {
                    question: true,
                    questionVersion: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    return schedule;
  }

  async update(id: string, dto: UpdateScheduleDto) {
    const schedule = await this.findOne(id);

    const accessCodeHash = dto.accessCode !== undefined
      ? (dto.accessCode ? this.hashAccessCode(dto.accessCode) : null)
      : schedule.accessCodeHash;

    return await this.prisma.quizSchedule.update({
      where: { id },
      data: {
        name: dto.name !== undefined ? dto.name : schedule.name,
        availableFrom: dto.availableFrom !== undefined ? new Date(dto.availableFrom) : schedule.availableFrom,
        availableUntil: dto.availableUntil !== undefined ? new Date(dto.availableUntil) : schedule.availableUntil,
        waitingRoomOpensAt: dto.waitingRoomOpensAt !== undefined ? (dto.waitingRoomOpensAt ? new Date(dto.waitingRoomOpensAt) : null) : schedule.waitingRoomOpensAt,
        requiredEarlyJoinMinutes: dto.requiredEarlyJoinMinutes !== undefined ? dto.requiredEarlyJoinMinutes : schedule.requiredEarlyJoinMinutes,
        accessMode: dto.accessMode !== undefined ? dto.accessMode : schedule.accessMode,
        accessCodeHash,
        capacity: dto.capacity !== undefined ? dto.capacity : schedule.capacity,
        priceOverride: dto.priceOverride !== undefined ? dto.priceOverride : schedule.priceOverride,
        autosaveIntervalSeconds: dto.autosaveIntervalSeconds !== undefined ? dto.autosaveIntervalSeconds : schedule.autosaveIntervalSeconds,
        heartbeatIntervalSeconds: dto.heartbeatIntervalSeconds !== undefined ? dto.heartbeatIntervalSeconds : schedule.heartbeatIntervalSeconds,
        shuffleQuestionsOverride: dto.shuffleQuestionsOverride !== undefined ? dto.shuffleQuestionsOverride : schedule.shuffleQuestionsOverride,
        shuffleOptionsOverride: dto.shuffleOptionsOverride !== undefined ? dto.shuffleOptionsOverride : schedule.shuffleOptionsOverride,
      },
    });
  }

  async publish(id: string, actorUserId: string) {
    const schedule = await this.findOne(id);

    return await this.prisma.$transaction(async (tx) => {
      // 1. Update status to OPEN (published status on QuizSchedule is represented as OPEN or active under scheduling metadata)
      const updatedSchedule = await tx.quizSchedule.update({
        where: { id },
        data: {
          status: "OPEN" as any,
          publishedAt: new Date(),
          publishedBy: actorUserId,
        },
      });

      // 2. Publish assessment.published event via RabbitMQ
      const payload = {
        scheduleId: schedule.id,
        quizId: schedule.quizRevision.quizId,
        quizRevisionId: schedule.quizRevisionId,
        code: schedule.code,
        name: schedule.name,
        availableFrom: schedule.availableFrom.toISOString(),
        availableUntil: schedule.availableUntil.toISOString(),
        durationMinutes: schedule.quizRevision.durationMinutes,
        accessMode: schedule.accessMode,
        status: "PUBLISHED",
        publishedAt: new Date().toISOString(),
        actorUserId,
      };

      if (this.channel) {
        try {
          this.channel.publish(
            "assessment.events",
            "assessment.published",
            Buffer.from(JSON.stringify(payload)),
            { persistent: true }
          );
          console.log(`[RabbitMQ] Event assessment.published sent for schedule ${schedule.id}`);
        } catch (err) {
          console.error(`[RabbitMQ] Failed to publish assessment.published event`, err);
        }
      }

      return updatedSchedule;
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.quizSchedule.update({
      where: { id },
      data: {
        status: "CANCELLED" as any,
        cancelledAt: new Date(),
        cancelledBy: "system_author",
      },
    });
  }
}
