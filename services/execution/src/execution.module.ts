import { Module } from "@nestjs/common";
import Redis from "ioredis";
import * as amqp from "amqplib";
import { ExecutionController } from "./execution.controller";
import { ExecutionService } from "./execution.service";
import { SseService } from "./infrastructure/sse.service";
import { RabbitMQConsumerService } from "./infrastructure/rabbitmq-consumer.service";
import { InMemoryAttemptStateStore } from "./infrastructure/in-memory-state-store";
import { InMemoryAttemptEventPublisher } from "./infrastructure/in-memory-event-publisher";
import { RedisAttemptStateStore } from "./infrastructure/redis-state-store";
import { RabbitMQAttemptEventPublisher } from "./infrastructure/rabbitmq-event-publisher";

@Module({
  controllers: [ExecutionController],
  providers: [
    ExecutionService,
    SseService,
    RabbitMQConsumerService,
    {
      provide: "REDIS_CLIENT",
      useFactory: () => {
        const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
        return new Redis(redisUrl, {
          maxRetriesPerRequest: null,
        });
      },
    },
    {
      provide: "RABBITMQ_CHANNEL",
      useFactory: async () => {
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
      useClass:
        process.env.USE_REDIS === "true"
          ? RedisAttemptStateStore
          : InMemoryAttemptStateStore,
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
