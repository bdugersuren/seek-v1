import { AssessmentRuntimeSession, AssessmentAnswerSnapshot } from "@seek/contracts";

export interface AttemptAuditEvent {
  id: string;
  attemptId: string;
  type: string;
  idempotencyKey?: string;
  payload: Record<string, unknown>;
  occurredAt: string;
}

export interface AttemptStateStore {
  getSession(attemptId: string): Promise<AssessmentRuntimeSession | null>;
  saveSession(session: AssessmentRuntimeSession): Promise<void>;
  getAnswers(attemptId: string): Promise<AssessmentAnswerSnapshot | null>;
  saveAnswers(attemptId: string, snapshot: AssessmentAnswerSnapshot): Promise<void>;
  saveQuestions(attemptId: string, questions: any[]): Promise<void>;
  incrementViolation(attemptId: string, type: string): Promise<number>;
  getViolationCount(attemptId: string, type: string): Promise<number>;
  getQuestions(attemptId: string): Promise<any[] | null>;
  appendAuditEvent(event: AttemptAuditEvent): Promise<void>;
  getAuditEvents(attemptId: string, type?: string): Promise<AttemptAuditEvent[]>;
  hasIdempotencyKey(attemptId: string, idempotencyKey: string): Promise<boolean>;
}
