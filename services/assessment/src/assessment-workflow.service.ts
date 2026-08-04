import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

type WorkflowEvent = {
  id: string;
  aggregateType: "question" | "blueprint" | "quiz" | "schedule" | "result";
  aggregateId: string;
  action: string;
  previousStatus?: string | null;
  newStatus: string;
  comment?: string | null;
  actorUserId: string;
  occurredAt: string;
  metadata: Record<string, unknown>;
};

type SchedulePublication = {
  scheduleId: string;
  status: "PUBLISHED";
  publishedAt: string;
  eligibilityMaterializationRequested: boolean;
  eventId: string;
};

@Injectable()
export class AssessmentWorkflowService {
  constructor(private readonly prisma: PrismaService) {}

  async transition(
    aggregateType: WorkflowEvent["aggregateType"],
    aggregateId: string,
    body: {
      action: string;
      newStatus: string;
      comment?: string;
      actorUserId: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<WorkflowEvent> {
    if (!body.actorUserId) {
      throw new BadRequestException("actorUserId is required");
    }
    if (!body.action || !body.newStatus) {
      throw new BadRequestException("action and newStatus are required");
    }

    let previousStatus: string | null = null;

    if (aggregateType === "question") {
      const lastEvent = await this.prisma.questionWorkflowEvent.findFirst({
        where: { questionId: aggregateId },
        orderBy: { occurredAt: "desc" },
      });
      previousStatus = lastEvent?.newStatus || null;

      const event = await this.prisma.questionWorkflowEvent.create({
        data: {
          questionId: aggregateId,
          previousStatus,
          newStatus: body.newStatus,
          action: body.action,
          comment: body.comment,
          actorUserId: body.actorUserId,
          metadata: (body.metadata as any) || {},
        },
      });

      return {
        id: event.id,
        aggregateType: "question",
        aggregateId: event.questionId,
        action: event.action,
        previousStatus: event.previousStatus,
        newStatus: event.newStatus,
        comment: event.comment,
        actorUserId: event.actorUserId,
        occurredAt: event.occurredAt.toISOString(),
        metadata: (event.metadata as Record<string, unknown>) || {},
      };
    } else {
      const lastEvent = await this.prisma.assessmentWorkflowEvent.findFirst({
        where: { aggregateType, aggregateId },
        orderBy: { occurredAt: "desc" },
      });
      previousStatus = lastEvent?.newStatus || null;

      const event = await this.prisma.assessmentWorkflowEvent.create({
        data: {
          aggregateType,
          aggregateId,
          previousStatus,
          newStatus: body.newStatus,
          action: body.action,
          comment: body.comment,
          actorUserId: body.actorUserId,
          metadata: (body.metadata as any) || {},
        },
      });

      return {
        id: event.id,
        aggregateType: event.aggregateType as any,
        aggregateId: event.aggregateId,
        action: event.action,
        previousStatus: event.previousStatus,
        newStatus: event.newStatus,
        comment: event.comment,
        actorUserId: event.actorUserId,
        occurredAt: event.occurredAt.toISOString(),
        metadata: (event.metadata as Record<string, unknown>) || {},
      };
    }
  }

  async listEvents(
    aggregateType: WorkflowEvent["aggregateType"],
    aggregateId: string
  ): Promise<WorkflowEvent[]> {
    if (aggregateType === "question") {
      const events = await this.prisma.questionWorkflowEvent.findMany({
        where: { questionId: aggregateId },
        orderBy: { occurredAt: "asc" },
      });
      return events.map((event) => ({
        id: event.id,
        aggregateType: "question",
        aggregateId: event.questionId,
        action: event.action,
        previousStatus: event.previousStatus,
        newStatus: event.newStatus,
        comment: event.comment,
        actorUserId: event.actorUserId,
        occurredAt: event.occurredAt.toISOString(),
        metadata: (event.metadata as Record<string, unknown>) || {},
      }));
    } else {
      const events = await this.prisma.assessmentWorkflowEvent.findMany({
        where: { aggregateType, aggregateId },
        orderBy: { occurredAt: "asc" },
      });
      return events.map((event) => ({
        id: event.id,
        aggregateType: event.aggregateType as any,
        aggregateId: event.aggregateId,
        action: event.action,
        previousStatus: event.previousStatus,
        newStatus: event.newStatus,
        comment: event.comment,
        actorUserId: event.actorUserId,
        occurredAt: event.occurredAt.toISOString(),
        metadata: (event.metadata as Record<string, unknown>) || {},
      }));
    }
  }

  async publishSchedule(
    scheduleId: string,
    body: { actorUserId: string; publishedRevisionHash?: string }
  ): Promise<SchedulePublication> {
    await this.prisma.quizSchedule.update({
      where: { id: scheduleId },
      data: {
        status: "PUBLISHED" as any,
        publishedRevisionHash: body.publishedRevisionHash,
      },
    });

    const event = await this.transition("schedule", scheduleId, {
      action: "publish",
      newStatus: "PUBLISHED",
      actorUserId: body.actorUserId,
      metadata: { publishedRevisionHash: body.publishedRevisionHash } as any,
    });

    return {
      scheduleId,
      status: "PUBLISHED",
      publishedAt: event.occurredAt,
      eligibilityMaterializationRequested: true,
      eventId: event.id,
    };
  }

  async getSchedulePublication(scheduleId: string): Promise<SchedulePublication> {
    const schedule = await this.prisma.quizSchedule.findUnique({
      where: { id: scheduleId },
    });

    if (!schedule || schedule.status !== ("PUBLISHED" as any)) {
      throw new NotFoundException(`Schedule ${scheduleId} has not been published`);
    }

    const lastPublishEvent = await this.prisma.assessmentWorkflowEvent.findFirst({
      where: {
        aggregateType: "schedule",
        aggregateId: scheduleId,
        newStatus: "PUBLISHED",
      },
      orderBy: { occurredAt: "desc" },
    });

    return {
      scheduleId,
      status: "PUBLISHED",
      publishedAt: lastPublishEvent?.occurredAt.toISOString() || schedule.updatedAt.toISOString(),
      eligibilityMaterializationRequested: true,
      eventId: lastPublishEvent?.id || "manual-publish",
    };
  }
}

