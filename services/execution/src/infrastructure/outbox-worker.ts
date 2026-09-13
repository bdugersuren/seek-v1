import { ExecutionService } from "../execution.service";
import { GradingService } from "../grading.service";
import { Inject, Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AttemptEventPublisher } from '../interfaces/event-publisher.interface';

@Injectable()
export class OutboxWorker implements OnModuleInit, OnModuleDestroy {
  private timer?: ReturnType<typeof setInterval>;
  private running = false;
  constructor(private readonly execution: ExecutionService, private readonly grading: GradingService, private readonly db: PrismaService, @Inject('AttemptEventPublisher') private readonly publisher: AttemptEventPublisher) {}
  onModuleInit() { this.timer = setInterval(() => void this.flush(), 2000); }
  onModuleDestroy() { if (this.timer) clearInterval(this.timer); }
  private async flush() {
    if (this.running) return;
    this.running = true;
    try {
      const expired=await this.db.quizAttempt.findMany({where:{status:{in:['IN_PROGRESS','EXPIRED']},expiresAt:{lte:new Date()}},select:{id:true},take:20});
      for(const row of expired){const runtime=await this.execution.getSession(row.id);await this.execution.submit({attemptId:row.id,idempotencyKey:`deadline:${row.id}`,reason:'timer_expired',submittedAt:new Date().toISOString(),finalSnapshot:runtime.snapshot});}
      await this.db.$transaction(async tx => {
        const events = await tx.$queryRaw<Array<{id: string; eventType: string; payload: any}>>`
          SELECT id, "eventType", payload FROM outbox_event
          WHERE status = 'PENDING' AND "availableAt" <= NOW()
          ORDER BY "createdAt" LIMIT 20 FOR UPDATE SKIP LOCKED`;
        for (const event of events) {
          try {
            const method = event.eventType as keyof AttemptEventPublisher;
            if (!['publishAnswerAutosaved','publishAttemptSubmitted','publishScoringRequested','publishViolationRecorded'].includes(method)) throw new Error('Unknown event type');
            if(method === 'publishScoringRequested') await this.grading.grade(event.payload.attemptId);
            await this.publisher[method](event.payload);
            await tx.outboxEvent.update({where:{id:event.id},data:{status:'PUBLISHED',publishedAt:new Date()}});
          } catch {
            await tx.outboxEvent.update({where:{id:event.id},data:{retryCount:{increment:1},availableAt:new Date(Date.now()+30000),lastError:'Delivery failed; retry scheduled'}});
          }
        }
      }, {timeout:30000});
    } catch { console.error('Execution outbox delivery unavailable'); }
    finally { this.running = false; }
  }
}
