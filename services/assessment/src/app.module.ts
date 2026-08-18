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
    AssessmentWorkflowController,
    QuestionController,
    BlueprintController,
    QuizController,
    ScheduleController,
    CatalogController,
  ],
  providers: [
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
          const rabbitmqUrl = process.env.RABBITMQ_URL || "amqp://localhost:5672";
          const conn = await amqp.connect(rabbitmqUrl);
          const channel = await conn.createChannel();
          await channel.assertExchange("assessment.events", "topic", { durable: true });
          console.log("[RabbitMQ] Connected successfully in assessment service");
          return channel;
        } catch (err) {
          console.error("[RabbitMQ] Failed to connect in assessment service", err);
          return null;
        }
      },
    },
  ],
})
export class AppModule {}


