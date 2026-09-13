import { CandidateController } from "./candidate.controller";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ContextAccessGuard, ContextAccessFilter, ContextAccessController } from "./context-access";
import { CognitiveService } from "./cognitive.service";
import { AudienceService } from "./audience.service";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AssessmentWorkflowController } from "./assessment-workflow.controller";
import { AssessmentWorkflowService } from "./assessment-workflow.service";
import { PrismaService } from "./prisma.service";
import { QuestionController } from "./question.controller";
import { QuestionService } from "./question.service";
import { BlueprintController } from "./blueprint.controller";
import { BlueprintService } from "./blueprint.service";
import { QuizController } from "./quiz.controller";
import { QuizService } from "./quiz.service";
import { ScheduleController } from "./schedule.controller";
import { ScheduleService } from "./schedule.service";
import { CatalogController } from "./catalog.controller";
import { CatalogService } from "./catalog.service";
import * as amqp from "amqplib";

@Module({
  imports: [],
  controllers: [
    AppController,
    ContextAccessController,
    AssessmentWorkflowController,
    QuestionController,
    BlueprintController,
    QuizController,
    ScheduleController,
    CatalogController,
    CandidateController,
  ],
  providers: [
    {provide: APP_GUARD, useClass: ContextAccessGuard},
    {provide: APP_INTERCEPTOR, useClass: ContextAccessFilter},
    AudienceService,
    CognitiveService,
    AssessmentWorkflowService,
    PrismaService,
    QuestionService,
    BlueprintService,
    QuizService,
    ScheduleService,
    CatalogService,
    {
      provide: "RABBITMQ_CHANNEL",
      useFactory: async (): Promise<amqp.Channel | null> => {
        try {
          const rabbitmqUrl =
            process.env.RABBITMQ_URL || "amqp://localhost:5672";
          const conn = await amqp.connect(rabbitmqUrl);
          const channel = await conn.createChannel();
          await channel.assertExchange("assessment.events", "topic", {
            durable: true,
          });
          console.log(
            "[RabbitMQ] Connected successfully in assessment service",
          );
          return channel;
        } catch (err) {
          console.error(
            "[RabbitMQ] Failed to connect in assessment service",
            err,
          );
          return null;
        }
      },
    },
  ],
})
export class AppModule {}
