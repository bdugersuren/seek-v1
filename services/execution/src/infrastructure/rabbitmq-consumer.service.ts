import { Injectable, Inject, OnApplicationBootstrap, BeforeApplicationShutdown } from "@nestjs/common";
import { Channel } from "amqplib";
import { SseService } from "./sse.service";

@Injectable()
export class RabbitMQConsumerService implements OnApplicationBootstrap, BeforeApplicationShutdown {
  private consumerTag?: string;

  constructor(
    @Inject("RABBITMQ_CHANNEL")
    private readonly channel: Channel | null,
    private readonly sseService: SseService
  ) {}

  async onApplicationBootstrap() {
    if (!this.channel) {
      console.log("[RabbitMQ Consumer] Channel not initialized. Skipping subscription.");
      return;
    }

    try {
      const queueName = "execution.attempt.unlock.queue";
      
      // Assert queue
      await this.channel.assertQueue(queueName, { durable: true });
      
      // Bind queue to exchange (routing key: attempt.started)
      await this.channel.bindQueue(
        queueName,
        "assessment.events",
        "attempt.started"
      );

      // Start consuming
      const consumeResult = await this.channel.consume(
        queueName,
        (msg) => {
          if (!msg) return;
          try {
            const content = JSON.parse(msg.content.toString());
            console.log("[RabbitMQ Consumer] Received attempt.started event:", content);
            
            if (content && content.attemptId && content.unlockKey) {
              this.sseService.emitUnlock(content.attemptId, content.unlockKey);
            }
            this.channel?.ack(msg);
          } catch (err) {
            console.error("[RabbitMQ Consumer] Error processing message:", err);
            // Reject message, don't requeue to avoid loop
            this.channel?.nack(msg, false, false);
          }
        },
        { noAck: false }
      );
      this.consumerTag = consumeResult.consumerTag;
      console.log(`[RabbitMQ Consumer] Subscribed to attempt.started events on queue: ${queueName}`);
    } catch (err) {
      console.error("[RabbitMQ Consumer] Failed to setup subscription:", err);
    }
  }

  async beforeApplicationShutdown() {
    if (this.channel && this.consumerTag) {
      try {
        await this.channel.cancel(this.consumerTag);
        console.log("[RabbitMQ Consumer] Canceled subscription");
      } catch (err) {
        console.error("[RabbitMQ Consumer] Error canceling subscription:", err);
      }
    }
  }
}
