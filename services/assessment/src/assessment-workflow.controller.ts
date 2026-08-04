import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AssessmentWorkflowService } from "./assessment-workflow.service";

@Controller("assessment")
export class AssessmentWorkflowController {
  constructor(private readonly workflowService: AssessmentWorkflowService) {}

  @Post("questions/:questionId/workflow")
  async questionWorkflow(
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
    return await this.workflowService.transition("question", questionId, body);
  }

  @Get("questions/:questionId/workflow")
  async questionWorkflowEvents(@Param("questionId") questionId: string) {
    return await this.workflowService.listEvents("question", questionId);
  }

  @Post("blueprints/:blueprintId/workflow")
  async blueprintWorkflow(
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
    return await this.workflowService.transition("blueprint", blueprintId, body);
  }

  @Post("quizzes/:quizId/workflow")
  async quizWorkflow(
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
    return await this.workflowService.transition("quiz", quizId, body);
  }

  @Post("schedules/:scheduleId/publish")
  async publishSchedule(
    @Param("scheduleId") scheduleId: string,
    @Body() body: { actorUserId: string; publishedRevisionHash?: string }
  ) {
    return await this.workflowService.publishSchedule(scheduleId, body);
  }

  @Get("schedules/:scheduleId/publication")
  async getSchedulePublication(@Param("scheduleId") scheduleId: string) {
    return await this.workflowService.getSchedulePublication(scheduleId);
  }
}

