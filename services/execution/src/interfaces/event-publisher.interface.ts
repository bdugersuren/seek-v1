export interface AttemptEventPublisher {
  publishAnswerAutosaved(event: {
    attemptId: string;
    idempotencyKey: string;
    localVersion: number;
    changedAnswers: Record<string, any>;
    clientSavedAt: string;
    serverSavedAt: string;
  }): Promise<void>;

  publishAttemptSubmitted(event: {
    attemptId: string;
    idempotencyKey: string;
    submittedAt: string;
    serverSubmittedAt: string;
    reason: string;
    finalSnapshot: any;
  }): Promise<void>;

  publishViolationRecorded(event: {
    attemptId: string;
    type: string;
    occurredAt: string;
    count: number;
    message: string;
  }): Promise<void>;

  publishScoringRequested(event: {
    attemptId: string;
    userId: string;
    quizId: string;
    submittedAt: string;
  }): Promise<void>;
}
