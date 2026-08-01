import { Injectable, Inject, OnModuleDestroy } from "@nestjs/common";
import * as amqp from "amqplib";
import { AttemptEventPublisher } from "../interfaces/event-publisher.interface";

@Injectable()
export class RabbitMQAttemptEventPublisher
  implements AttemptEventPublisher, OnModuleDestroy
{
  private readonly exchangeName = "assessment.events";

  constructor(
    @Inject("RABBITMQ_CHANNEL")
    private readonly channel: amqp.Channel | null
  ) {}

  private async publishEvent(routingKey: string, payload: any): Promise<void> {
    if (!this.channel) {
      console.warn(
        `[RabbitMQ] Channel not initialized. Falling back to log-only. Event: routingKey=${routingKey}, attemptId=${payload.attemptId}`
      );
      return;
    }

    try {
      const messageBuffer = Buffer.from(JSON.stringify(payload));
      this.channel.publish(this.exchangeName, routingKey, messageBuffer, {
        persistent: true,
      });
      console.log(`[RabbitMQ] Event published: routingKey=${routingKey}, attemptId=${payload.attemptId}`);
    } catch (err) {
      console.error(
        `[RabbitMQ] Failed to publish event: routingKey=${routingKey}, attemptId=${payload.attemptId}`,
        err
      );
    }
  }

  async publishAnswerAutosaved(event: {
    attemptId: string;
    idempotencyKey: string;
    localVersion: number;
    changedAnswers: Record<string, any>;
    clientSavedAt: string;
    serverSavedAt: string;
  }): Promise<void> {
    await this.publishEvent("attempt.answer.autosaved", event);
  }

  async publishAttemptSubmitted(event: {
    attemptId: string;
    idempotencyKey: string;
    submittedAt: string;
    serverSubmittedAt: string;
    reason: string;
    finalSnapshot: any;
  }): Promise<void> {
    await this.publishEvent("attempt.submitted", event);
  }

  async publishViolationRecorded(event: {
    attemptId: string;
    type: string;
    occurredAt: string;
    count: number;
    message: string;
  }): Promise<void> {
    await this.publishEvent("attempt.violation.recorded", event);
  }

  async publishScoringRequested(event: {
    attemptId: string;
    userId: string;
    quizId: string;
    submittedAt: string;
  }): Promise<void> {
    await this.publishEvent("attempt.scoring.requested", event);
  }

  async onModuleDestroy() {
    if (this.channel) {
      try {
        await this.channel.close();
        console.log("[RabbitMQ] Channel closed successfully");
      } catch (err) {
        console.error("[RabbitMQ] Error closing channel", err);
      }
    }
  }
}
