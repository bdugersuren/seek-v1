import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AssessmentWorkflowService } from "./assessment-workflow.service";

@Controller("assessment")
export class AssessmentWorkflowController {
  constructor(private readonly workflowService: AssessmentWorkflowService) {}

  @Post("questions/:questionId/workflow")
  questionWorkflow(
    @Param("questionId") questionId: string,
    @Body()
    body: {
      action: string;
      newStatus: string;
      comment?: string;
      actorUserId: string;
      metadata?: Record<string, unknown>;
    }
  ) {
    return this.workflowService.transition("question", questionId, body);
  }

  @Get("questions/:questionId/workflow")
  questionWorkflowEvents(@Param("questionId") questionId: string) {
    return this.workflowService.listEvents("question", questionId);
  }

  @Post("blueprints/:blueprintId/workflow")
  blueprintWorkflow(
    @Param("blueprintId") blueprintId: string,
    @Body()
    body: {
      action: string;
      newStatus: string;
      comment?: string;
      actorUserId: string;
      metadata?: Record<string, unknown>;
    }
  ) {
    return this.workflowService.transition("blueprint", blueprintId, body);
  }

  @Post("quizzes/:quizId/workflow")
  quizWorkflow(
    @Param("quizId") quizId: string,
    @Body()
    body: {
      action: string;
      newStatus: string;
      comment?: string;
      actorUserId: string;
      metadata?: Record<string, unknown>;
    }
  ) {
    return this.workflowService.transition("quiz", quizId, body);
  }

  @Post("schedules/:scheduleId/publish")
  publishSchedule(
    @Param("scheduleId") scheduleId: string,
    @Body() body: { actorUserId: string; publishedRevisionHash?: string }
  ) {
    return this.workflowService.publishSchedule(scheduleId, body);
  }

  @Get("schedules/:scheduleId/publication")
  getSchedulePublication(@Param("scheduleId") scheduleId: string) {
    return this.workflowService.getSchedulePublication(scheduleId);
  }
}
