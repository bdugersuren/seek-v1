import { BadRequestException } from "@nestjs/common";
import { AssessmentWorkflowService } from "../src/assessment-workflow.service";

describe("AssessmentWorkflowService", () => {
  let service: AssessmentWorkflowService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      questionWorkflowEvent: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
      },
      assessmentWorkflowEvent: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
      },
      quizSchedule: {
        update: jest.fn(),
        findUnique: jest.fn(),
      },
      questionVersion: {
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      question: {
        update: jest.fn(),
      },
      $transaction: jest.fn((cb) => cb(mockPrisma)),
    };
    service = new AssessmentWorkflowService(mockPrisma as any);
  });

  it("records question workflow events with previous and new status", async () => {
    mockPrisma.questionWorkflowEvent.findFirst.mockResolvedValueOnce(null);
    mockPrisma.questionWorkflowEvent.create.mockResolvedValueOnce({
      id: "event-1",
      questionId: "question-1",
      previousStatus: null,
      newStatus: "IN_REVIEW",
      action: "request_approval",
      comment: "ready",
      actorUserId: "author-1",
      occurredAt: new Date(),
      metadata: {},
    });

    const requested = await service.transition("question", "question-1", {
      action: "request_approval",
      newStatus: "IN_REVIEW",
      actorUserId: "author-1",
      comment: "ready",
    });

    mockPrisma.questionWorkflowEvent.findFirst.mockResolvedValueOnce({
      newStatus: "IN_REVIEW",
    });
    mockPrisma.questionWorkflowEvent.create.mockResolvedValueOnce({
      id: "event-2",
      questionId: "question-1",
      previousStatus: "IN_REVIEW",
      newStatus: "APPROVED",
      action: "approve",
      actorUserId: "reviewer-1",
      occurredAt: new Date(),
      metadata: {},
    });

    const approved = await service.transition("question", "question-1", {
      action: "approve",
      newStatus: "APPROVED",
      actorUserId: "reviewer-1",
    });

    expect(requested.previousStatus).toBeNull();
    expect(approved.previousStatus).toBe("IN_REVIEW");

    mockPrisma.questionWorkflowEvent.findMany.mockResolvedValueOnce([
      { id: "event-1", questionId: "question-1", previousStatus: null, newStatus: "IN_REVIEW", action: "request_approval", comment: "ready", actorUserId: "author-1", occurredAt: new Date(), metadata: {} },
      { id: "event-2", questionId: "question-1", previousStatus: "IN_REVIEW", newStatus: "APPROVED", action: "approve", actorUserId: "reviewer-1", occurredAt: new Date(), metadata: {} },
    ]);
    const list = await service.listEvents("question", "question-1");
    expect(list).toHaveLength(2);
  });

  it("publishes schedules and requests eligibility materialization", async () => {
    mockPrisma.quizSchedule.update.mockResolvedValueOnce({});
    mockPrisma.assessmentWorkflowEvent.findFirst.mockResolvedValueOnce(null);
    mockPrisma.assessmentWorkflowEvent.create.mockResolvedValueOnce({
      id: "event-1",
      aggregateType: "schedule",
      aggregateId: "schedule-1",
      previousStatus: null,
      newStatus: "PUBLISHED",
      action: "publish",
      actorUserId: "admin-1",
      occurredAt: new Date(),
      metadata: { publishedRevisionHash: "sha256:revision" },
    });

    const publication = await service.publishSchedule("schedule-1", {
      actorUserId: "admin-1",
      publishedRevisionHash: "sha256:revision",
    });

    expect(publication.status).toBe("PUBLISHED");
    expect(publication.eligibilityMaterializationRequested).toBe(true);

    mockPrisma.quizSchedule.findUnique.mockResolvedValueOnce({
      id: "schedule-1",
      status: "PUBLISHED",
      updatedAt: new Date(),
    });
    mockPrisma.assessmentWorkflowEvent.findFirst.mockResolvedValueOnce({
      id: "event-1",
      occurredAt: new Date(),
    });
    const retrieved = await service.getSchedulePublication("schedule-1");
    expect(retrieved.status).toBe("PUBLISHED");
  });

  it("requires an actor for workflow transitions", async () => {
    await expect(
      service.transition("question", "question-1", {
        action: "approve",
        newStatus: "APPROVED",
        actorUserId: "",
      })
    ).rejects.toThrow(BadRequestException);
  });
});

