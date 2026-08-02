import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

type WorkflowEvent = {
  id: string;
  aggregateType: "question" | "blueprint" | "quiz" | "schedule" | "result";
  aggregateId: string;
  action: string;
  previousStatus?: string;
  newStatus: string;
  comment?: string;
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
  private readonly statuses = new Map<string, string>();
  private readonly events: WorkflowEvent[] = [];
  private readonly publications = new Map<string, SchedulePublication>();

  private createId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  transition(
    aggregateType: WorkflowEvent["aggregateType"],
    aggregateId: string,
    body: {
      action: string;
      newStatus: string;
      comment?: string;
      actorUserId: string;
      metadata?: Record<string, unknown>;
    }
  ) {
    if (!body.actorUserId) {
      throw new BadRequestException("actorUserId is required");
    }
    if (!body.action || !body.newStatus) {
      throw new BadRequestException("action and newStatus are required");
    }

    const key = `${aggregateType}:${aggregateId}`;
    const previousStatus = this.statuses.get(key);
    this.statuses.set(key, body.newStatus);

    const event: WorkflowEvent = {
      id: this.createId(`${aggregateType}-workflow`),
      aggregateType,
      aggregateId,
      action: body.action,
      previousStatus,
      newStatus: body.newStatus,
      comment: body.comment,
      actorUserId: body.actorUserId,
      occurredAt: new Date().toISOString(),
      metadata: body.metadata || {},
    };
    this.events.push(event);
    return event;
  }

  listEvents(aggregateType: WorkflowEvent["aggregateType"], aggregateId: string) {
    return this.events.filter(
      (event) =>
        event.aggregateType === aggregateType && event.aggregateId === aggregateId
    );
  }

  publishSchedule(
    scheduleId: string,
    body: { actorUserId: string; publishedRevisionHash?: string }
  ): SchedulePublication {
    const event = this.transition("schedule", scheduleId, {
      action: "publish",
      newStatus: "PUBLISHED",
      actorUserId: body.actorUserId,
      metadata: { publishedRevisionHash: body.publishedRevisionHash },
    });
    const publication: SchedulePublication = {
      scheduleId,
      status: "PUBLISHED",
      publishedAt: event.occurredAt,
      eligibilityMaterializationRequested: true,
      eventId: event.id,
    };
    this.publications.set(scheduleId, publication);
    return publication;
  }

  getSchedulePublication(scheduleId: string): SchedulePublication {
    const publication = this.publications.get(scheduleId);
    if (!publication) {
      throw new NotFoundException(`Schedule ${scheduleId} has not been published`);
    }
    return publication;
  }
}
