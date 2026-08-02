import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AssessmentWorkflowController } from "./assessment-workflow.controller";
import { AssessmentWorkflowService } from "./assessment-workflow.service";

@Module({
  imports: [],
  controllers: [AppController, AssessmentWorkflowController],
  providers: [AssessmentWorkflowService],
})
export class AppModule {}
