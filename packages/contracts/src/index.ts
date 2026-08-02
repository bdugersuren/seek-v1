// Shared contracts / API & Event interfaces
export interface HealthResponse {
  status: string;
  timestamp: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    status: string;
  };
}

export interface RefreshResponse {
  accessToken: string;
}

export interface CurrentUserResponse {
  id: string;
  email: string;
  status: string;
}

export interface AuthenticationError {
  statusCode: number;
  message: string;
  error: string;
}

export type AssessmentQuestionType =
  | "single_choice"
  | "multiple_choice"
  | "matching"
  | "ordering"
  | "fill_blank"
  | "matrix"
  | "numeric"
  | "likert"
  | "sjt"
  | "case_bundle"
  | "essay";

export type AssessmentAttemptStatus =
  | "waiting"
  | "preloaded"
  | "active"
  | "autosaving"
  | "offline"
  | "pending_submit"
  | "submitted"
  | "expired"
  | "locked";

export type AssessmentAccessMode =
  | "public"
  | "private_code"
  | "assigned_users";

export type AssessmentResultReleaseMode =
  | "immediate"
  | "after_close"
  | "manual";

export type AssessmentRuntimeViolationType =
  | "fullscreen_exit"
  | "visibility_hidden"
  | "window_blur"
  | "copy_attempt"
  | "paste_attempt"
  | "context_menu"
  | "network_loss"
  | "device_change";

export interface AssessmentAttemptToken {
  attemptId: string;
  quizId: string;
  userId: string;
  token: string;
  expiresAt: string;
  issuedAt: string;
  accessMode: AssessmentAccessMode;
}

export interface CreateAssessmentAttemptRequest {
  assessmentId: string;
  idempotencyKey?: string;
}

export interface CreateAssessmentAttemptResponse {
  attemptId: string;
  quizId: string;
  waitingUrl: string;
  status: AssessmentAttemptStatus;
}

export interface StartAssessmentAttemptResponse {
  attemptId: string;
  quizId: string;
  status: AssessmentAttemptStatus;
  unlockKey: string;
  serverNow: string;
}

export interface AssessmentQuestionManifest {
  id: string;
  code: string;
  type: AssessmentQuestionType;
  sectionId: string;
  sectionName: string;
  order: number;
  points: number;
  required: boolean;
  mediaUrls?: string[];
}

export interface EncryptedAssessmentPayload {
  payloadId: string;
  quizId: string;
  attemptId: string;
  algorithm: "AES-GCM";
  keyDelivery: "start_unlock_event";
  encryptedContent: string;
  iv: string;
  checksum: string;
  createdAt: string;
}

export interface AssessmentUnlockEvent {
  attemptId: string;
  quizId: string;
  unlockKey: string;
  serverNow: string;
  startsAt: string;
  endsAt: string;
  eventId: string;
}

export interface AssessmentProctoringPolicy {
  requireFullscreen: boolean;
  warnOnVisibilityChange: boolean;
  warnOnWindowBlur: boolean;
  disableCopyPaste: boolean;
  disableContextMenu: boolean;
  maxWarningsBeforeLock: number;
  lockOnViolation: boolean;
}

export interface AssessmentResultVisibilityPolicy {
  hideSolutions: boolean;
  showLeaderboard: boolean;
  showScore: boolean;
  showCorrectness: boolean;
  showCorrectAnswers: boolean;
  showExplanations: boolean;
  resultReleaseMode: AssessmentResultReleaseMode;
}

export interface AssessmentRuntimeSession {
  attemptId: string;
  quizId: string;
  assessmentTitle: string;
  userId: string;
  userDisplayName: string;
  serverNow: string;
  startsAt: string;
  endsAt: string;
  durationSeconds: number;
  status: AssessmentAttemptStatus;
  manifest: AssessmentQuestionManifest[];
  encryptedPayload?: EncryptedAssessmentPayload;
  proctoringPolicy: AssessmentProctoringPolicy;
  resultVisibilityPolicy: AssessmentResultVisibilityPolicy;
  autosaveIntervalSeconds: number;
  heartbeatIntervalSeconds: number;
  scheduledStartsAt?: string;
  scheduledEndsAt?: string;
  waitingRoomOpensAt?: string;
  requiredEarlyJoinMinutes?: number;
  questionCount?: number;
  totalPoints?: number;
  passingPercent?: number;
}

export type AssessmentAnswerValue =
  | string
  | string[]
  | number
  | boolean
  | Record<string, string | number | boolean | null>
  | null;

export interface AssessmentAnswerSnapshot {
  attemptId: string;
  answers: Record<string, AssessmentAnswerValue>;
  markedForReview: Record<string, boolean>;
  currentQuestionId?: string;
  localVersion: number;
  serverVersion: number;
  lastSavedAt?: string;
  pendingSubmit: boolean;
}

export interface AssessmentHeartbeatRequest {
  attemptId: string;
  clientNow: string;
  localVersion: number;
  visible: boolean;
  fullscreen: boolean;
}

export interface AssessmentHeartbeatResponse {
  attemptId: string;
  serverNow: string;
  remainingSeconds: number;
  status: AssessmentAttemptStatus;
  forceSubmit: boolean;
  warning?: string;
  serverVersion: number;
}

export interface AssessmentAutosaveRequest {
  attemptId: string;
  idempotencyKey: string;
  localVersion: number;
  changedAnswers: Record<string, AssessmentAnswerValue>;
  markedForReview?: Record<string, boolean>;
  clientSavedAt: string;
}

export interface AssessmentAutosaveResponse {
  attemptId: string;
  accepted: boolean;
  serverVersion: number;
  serverSavedAt: string;
  rejectedQuestionIds?: string[];
}

export interface AssessmentRuntimeViolation {
  attemptId: string;
  type: AssessmentRuntimeViolationType;
  occurredAt: string;
  count: number;
  message: string;
}

export interface AssessmentSubmitRequest {
  attemptId: string;
  idempotencyKey: string;
  finalSnapshot: AssessmentAnswerSnapshot;
  submittedAt: string;
  reason: "user_submit" | "timer_expired" | "offline_expired" | "policy_lock";
}

export interface AssessmentSubmitResponse {
  attemptId: string;
  accepted: boolean;
  status: "submitted" | "already_submitted" | "expired" | "locked";
  receiptId: string;
  serverSubmittedAt: string;
  answeredCount: number;
  totalQuestions: number;
}
