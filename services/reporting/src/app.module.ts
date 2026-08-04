import { Module } from "@nestjs/common";
import * as amqp from "amqplib";
import { AppController } from "./app.controller";
import { ReportingController } from "./reporting.controller";
import { ReportingService } from "./reporting.service";
import { PrismaService } from "./prisma.service";
import { RabbitMQConsumerService } from "./infrastructure/rabbitmq-consumer.service";

@Module({
  imports: [],
  controllers: [AppController, ReportingController],
  providers: [
    ReportingService,
    PrismaService,
    RabbitMQConsumerService,
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
  ],
})
export class AppModule {}

