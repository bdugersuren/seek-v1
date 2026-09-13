import { QuestionStatisticsController } from "./question-statistics";
import { ResultsController } from "./results.controller";
import { GradingService } from "./grading.service";
import { CandidateAttemptService } from "./candidate-attempt.service";
import { OutboxWorker } from "./infrastructure/outbox-worker";
import { AttemptOwnerGuard } from "./attempt-owner.guard";
import { Module } from "@nestjs/common";
import Redis from "ioredis";
import * as amqp from "amqplib";
import { ExecutionController } from "./execution.controller";
import { ExecutionService } from "./execution.service";
import { SseService } from "./infrastructure/sse.service";
import { RabbitMQConsumerService } from "./infrastructure/rabbitmq-consumer.service";
import { PrismaService } from "./prisma.service";
import { PrismaAttemptStateStore } from "./infrastructure/prisma-state-store";
import { InMemoryAttemptEventPublisher } from "./infrastructure/in-memory-event-publisher";
import { RabbitMQAttemptEventPublisher } from "./infrastructure/rabbitmq-event-publisher";
import { CryptoKMSService } from "./infrastructure/crypto-kms.service";
import { SignatureGuard } from "./infrastructure/guards/signature.guard";

@Module({
  controllers: [ExecutionController, ResultsController, QuestionStatisticsController],
  providers: [
    ExecutionService,
    OutboxWorker,
    CandidateAttemptService,
    GradingService,
    AttemptOwnerGuard,
    SseService,
    RabbitMQConsumerService,
    PrismaService,
    CryptoKMSService,
    SignatureGuard,
    {
      provide: "REDIS_CLIENT",
      useFactory: () => {
        if (process.env.USE_REDIS !== "true") {
          return null;
        }

        const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
        return new Redis(redisUrl, {
          maxRetriesPerRequest: null,
          lazyConnect: true,
        });
      },
    },
    {
      provide: "RABBITMQ_CHANNEL",
      useFactory: async () => {
        if (process.env.USE_RABBITMQ !== "true") {
          return null;
        }

        const rabbitmqUrl = process.env.RABBITMQ_URL || "amqp://localhost:5672";
        try {
          const conn = await amqp.connect(rabbitmqUrl);
          // A lost broker connection must restart the worker, never silently drop events.
          conn.on("error", () => console.error("RabbitMQ connection error"));
          conn.on("close", () => { if (process.env.NODE_ENV === "production") process.exit(1); });
          const channel = await conn.createConfirmChannel();
          channel.on("error", () => console.error("RabbitMQ channel error"));
          channel.on("close", () => { if (process.env.NODE_ENV === "production") process.exit(1); });
          await channel.assertExchange("assessment.events", "topic", {
            durable: true,
          });
          return channel;
        } catch (err) {
          if (process.env.NODE_ENV === "production") throw new Error("RabbitMQ connection required in production");
          console.error(
            "Failed to connect to RabbitMQ, using log fallback for publisher.",
            err
          );
          return null;
        }
      },
    },
    {
      provide: "AttemptStateStore",
      useClass: PrismaAttemptStateStore,
    },
    {
      provide: "AttemptEventPublisher",
      useClass:
        process.env.USE_RABBITMQ === "true"
          ? RabbitMQAttemptEventPublisher
          : InMemoryAttemptEventPublisher,
    },
  ],
  exports: [ExecutionService, SseService, RabbitMQConsumerService],
})
export class ExecutionModule {}


