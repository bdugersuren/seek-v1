import { BadRequestException } from "@nestjs/common";
import { AssessmentWorkflowService } from "../src/assessment-workflow.service";

describe("AssessmentWorkflowService", () => {
  let service: AssessmentWorkflowService;

  beforeEach(() => {
    service = new AssessmentWorkflowService();
  });

  it("records question workflow events with previous and new status", () => {
    const requested = service.transition("question", "question-1", {
      action: "request_approval",
      newStatus: "IN_REVIEW",
      actorUserId: "author-1",
      comment: "ready",
    });
    const approved = service.transition("question", "question-1", {
      action: "approve",
      newStatus: "APPROVED",
      actorUserId: "reviewer-1",
    });

    expect(requested.previousStatus).toBeUndefined();
    expect(approved.previousStatus).toBe("IN_REVIEW");
    expect(service.listEvents("question", "question-1")).toHaveLength(2);
  });

  it("publishes schedules and requests eligibility materialization", () => {
    const publication = service.publishSchedule("schedule-1", {
      actorUserId: "admin-1",
      publishedRevisionHash: "sha256:revision",
    });

    expect(publication.status).toBe("PUBLISHED");
    expect(publication.eligibilityMaterializationRequested).toBe(true);
    expect(service.getSchedulePublication("schedule-1")).toEqual(publication);
  });

  it("requires an actor for workflow transitions", () => {
    expect(() =>
      service.transition("question", "question-1", {
        action: "approve",
        newStatus: "APPROVED",
        actorUserId: "",
      })
    ).toThrow(BadRequestException);
  });
});
