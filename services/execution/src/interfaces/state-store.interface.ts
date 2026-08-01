import { AssessmentRuntimeSession, AssessmentAnswerSnapshot } from "@seek/contracts";

export interface AttemptStateStore {
  getSession(attemptId: string): Promise<AssessmentRuntimeSession | null>;
  saveSession(session: AssessmentRuntimeSession): Promise<void>;
  getAnswers(attemptId: string): Promise<AssessmentAnswerSnapshot | null>;
  saveAnswers(attemptId: string, snapshot: AssessmentAnswerSnapshot): Promise<void>;
  incrementViolation(attemptId: string, type: string): Promise<number>;
  getViolationCount(attemptId: string, type: string): Promise<number>;
  getQuestions(attemptId: string): Promise<any[] | null>;
}
