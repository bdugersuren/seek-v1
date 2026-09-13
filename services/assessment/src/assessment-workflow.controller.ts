import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { actorFrom, transitionQuestion } from "./question-workflow";
import { PrismaService } from "./prisma.service";
import { AssessmentWorkflowService } from "./assessment-workflow.service";

@Controller("assessment")
export class AssessmentWorkflowController {
  constructor(private readonly workflowService: AssessmentWorkflowService, private readonly db: PrismaService) {}

  @Post("questions/:questionId/workflow")
  async questionWorkflow(
    @Param("questionId") questionId: string,
    @Body() body: any,
    @Req() req: any,
  ) {
    return transitionQuestion(this.db, questionId, body, actorFrom(req));
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

  @Get("schedules/:scheduleId/publication")
  async getSchedulePublication(@Param("scheduleId") scheduleId: string) {
    return await this.workflowService.getSchedulePublication(scheduleId);
  }
}

