import { Injectable, Inject, OnApplicationBootstrap, BeforeApplicationShutdown } from "@nestjs/common";
import { Channel } from "amqplib";
import { ReportingService } from "../reporting.service";

@Injectable()
export class RabbitMQConsumerService implements OnApplicationBootstrap, BeforeApplicationShutdown {
  private consumerTag?: string;

  constructor(
    @Inject("RABBITMQ_CHANNEL")
    private readonly channel: Channel | null,
    private readonly reportingService: ReportingService
  ) {}

  async onApplicationBootstrap() {
    if (!this.channel) {
      console.log("[Reporting RabbitMQ Consumer] Channel not initialized. Skipping subscription.");
      return;
    }

    try {
      const queueName = "reporting.attempt.facts.queue";
      
      // Assert queue
      await this.channel.assertQueue(queueName, { durable: true });
      
      // Bind queue to exchange for attempt.submitted and assessment.result.finalized
      await this.channel.bindQueue(
        queueName,
        "assessment.events",
        "attempt.submitted"
      );
      await this.channel.bindQueue(
        queueName,
        "assessment.events",
        "assessment.result.finalized"
      );

      // Start consuming
      const consumeResult = await this.channel.consume(
        queueName,
        async (msg) => {
          if (!msg) return;
          try {
            const routingKey = msg.fields.routingKey;
            const content = JSON.parse(msg.content.toString());
            console.log(`[Reporting RabbitMQ Consumer] Received event ${routingKey}:`, content);
            
            if (routingKey === "attempt.submitted") {
              // Create initial draft fact when attempt is submitted
              await this.reportingService.projectAssessmentResultFinalized({
                attemptId: content.attemptId,
                scheduleId: content.scheduleId || "default-schedule",
                quizId: content.quizId || "default-quiz",
                quizRevisionId: content.quizRevisionId || "default-revision",
                candidateId: content.candidateId || "candidate-001",
                submittedAt: content.submittedAt || content.serverSubmittedAt,
                status: "SUBMITTED",
              });
            } else if (routingKey === "assessment.result.finalized") {
              // Finalize reporting fact with final score
              await this.reportingService.projectAssessmentResultFinalized({
                attemptId: content.attemptId,
                resultId: content.resultId,
                tenantId: content.tenantId,
                scheduleId: content.scheduleId,
                quizId: content.quizId,
                quizRevisionId: content.quizRevisionId,
                candidateId: content.candidateId,
                organizationId: content.organizationId,
                regionId: content.regionId,
                districtId: content.districtId,
                schoolId: content.schoolId,
                classId: content.classId,
                teacherId: content.teacherId,
                assessmentContextId: content.assessmentContextId,
                startedAt: content.startedAt,
                submittedAt: content.submittedAt,
                durationSeconds: content.durationSeconds,
                finalScore: content.finalScore,
                maxPossibleScore: content.maxPossibleScore,
                percentage: content.percentage,
                passStatus: content.passStatus,
                status: "FINAL",
              });
            }

            this.channel?.ack(msg);
          } catch (err) {
            console.error("[Reporting RabbitMQ Consumer] Error processing message:", err);
            // Reject message, don't requeue to avoid loop
            this.channel?.nack(msg, false, false);
          }
        },
        { noAck: false }
      );
      this.consumerTag = consumeResult.consumerTag;
      console.log(`[Reporting RabbitMQ Consumer] Subscribed to events on queue: ${queueName}`);
    } catch (err) {
      console.error("[Reporting RabbitMQ Consumer] Failed to setup subscription:", err);
    }
  }

  async beforeApplicationShutdown() {
    if (this.channel && this.consumerTag) {
      try {
        await this.channel.cancel(this.consumerTag);
        console.log("[Reporting RabbitMQ Consumer] Canceled subscription");
      } catch (err) {
        console.error("[Reporting RabbitMQ Consumer] Error canceling subscription:", err);
      }
    }
  }
}
