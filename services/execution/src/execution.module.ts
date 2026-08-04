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
  controllers: [ExecutionController],
  providers: [
    ExecutionService,
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
          const channel = await conn.createChannel();
          await channel.assertExchange("assessment.events", "topic", {
            durable: true,
          });
          return channel;
        } catch (err) {
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


