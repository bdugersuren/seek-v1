import { Injectable } from "@nestjs/common";
import { AttemptEventPublisher } from "../interfaces/event-publisher.interface";

@Injectable()
export class InMemoryAttemptEventPublisher implements AttemptEventPublisher {
  async publishAnswerAutosaved(event: {
    attemptId: string;
    idempotencyKey: string;
    localVersion: number;
    changedAnswers: Record<string, any>;
    clientSavedAt: string;
    serverSavedAt: string;
  }): Promise<void> {
    console.log(
      `[Event Queue] Answer autosaved: attemptId=${event.attemptId}, localVersion=${event.localVersion}, answersCount=${Object.keys(event.changedAnswers).length}, clientSavedAt=${event.clientSavedAt}`
    );
  }

  async publishAttemptSubmitted(event: {
    attemptId: string;
    idempotencyKey: string;
    submittedAt: string;
    serverSubmittedAt: string;
    reason: string;
    finalSnapshot: any;
  }): Promise<void> {
    console.log(
      `[Event Queue] Attempt submitted: attemptId=${event.attemptId}, reason=${event.reason}, submittedAt=${event.submittedAt}`
    );
  }

  async publishViolationRecorded(event: {
    attemptId: string;
    type: string;
    occurredAt: string;
    count: number;
    message: string;
  }): Promise<void> {
    console.log(
      `[Event Queue] Violation recorded: attemptId=${event.attemptId}, type=${event.type}, count=${event.count}, occurredAt=${event.occurredAt}`
    );
  }

  async publishScoringRequested(event: {
    attemptId: string;
    userId: string;
    quizId: string;
    submittedAt: string;
  }): Promise<void> {
    console.log(
      `[Event Queue] Scoring requested: attemptId=${event.attemptId}, userId=${event.userId}, quizId=${event.quizId}`
    );
  }
}
