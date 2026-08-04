// Shared contracts / API & Event interfaces
export interface HealthResponse {
  status: string;
  timestamp: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  status: string;
  emailVerificationRequired: boolean;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  success: boolean;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  success: boolean;
}

export interface SessionSummary {
  id: string;
  userAgentSummary?: string | null;
  ipAddressSummary?: string | null;
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
  revokedAt?: string | null;
  revocationReason?: string | null;
}

export interface SessionsResponse {
  sessions: SessionSummary[];
}

export type ProfileMissingField =
  | "displayName"
  | "phoneNumber"
  | "phoneNumberVerified"
  | "country"
  | "preferredLanguage";

export const PROFILE_LANGUAGES = ["mn", "en"] as const;
export type ProfileLanguage = (typeof PROFILE_LANGUAGES)[number];

export const PROFILE_GENDERS = ["Эрэгтэй", "Эмэгтэй", "Бусад"] as const;
export type ProfileGender = (typeof PROFILE_GENDERS)[number];

export interface CandidateProfileResponse {
  userId: string;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  phoneNumberVerifiedAt: string | null;
  organisation: string | null;
  birthDate: string | null;
  gender: string | null;
  country: string | null;
  address: string | null;
  preferredLanguage: string | null;
  completionStatus: string | null;
  verifiedAt: string | null;
  metadata: Record<string, any>;
  basicComplete: boolean;
  trustedComplete: boolean;
  isComplete: boolean;
  missingFields: ProfileMissingField[];
  recommendedFields: string[];
}

export interface UpdateCandidateProfileRequest {
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  organisation?: string | null;
  birthDate?: string | null;
  gender?: string | null;
  country?: string | null;
  address?: string | null;
  preferredLanguage?: string | null;
  metadata?: Record<string, any> | null;
}

export interface ProfileCompletionStatus {
  basicComplete: boolean;
  trustedComplete: boolean;
  isComplete: boolean;
  missingFields: ProfileMissingField[];
  recommendedFields: string[];
  nextAction: "COMPLETE_PROFILE" | "CONTINUE";
  blockingReasons?: string[];
}

export type ProfileVerificationStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "VERIFIED"
  | "REJECTED"
  | "EXPIRED";

export const PROFILE_VERIFICATION_TYPES = [
  "IDENTITY",
  "EMPLOYMENT",
  "ORGANISATION",
  "EDUCATION",
  "ASSESSOR",
] as const;
export type ProfileVerificationType = (typeof PROFILE_VERIFICATION_TYPES)[number];

export const PROFILE_VERIFICATION_STATUSES = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "SUBMITTED",
  "VERIFIED",
  "REJECTED",
  "EXPIRED",
] as const satisfies readonly ProfileVerificationStatus[];

export interface ProfileVerificationResponse {
  id: string;
  profileId: string;
  status: ProfileVerificationStatus;
  type: ProfileVerificationType;
  rejectedReason: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileDocumentResponse {
  id: string;
  profileId: string;
  type: ProfileVerificationType;
  name: string;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
  status: ProfileDocumentStatus;
  uploadedAt: string;
}

export const PROFILE_DOCUMENT_STATUSES = [
  "UPLOADED",
  "VERIFIED",
  "REJECTED",
] as const;
export type ProfileDocumentStatus = (typeof PROFILE_DOCUMENT_STATUSES)[number];

export interface ProfileAuditLogResponse {
  id: string;
  profileId: string;
  userId: string;
  actorUserId: string;
  action: string;
  before: Record<string, any>;
  after: Record<string, any>;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface ApproveVerificationRequest {
  reviewerId?: string;
}

export interface RejectVerificationRequest {
  rejectedReason: string;
  reviewerId?: string;
}

export type AssessmentGateBlockedReason =
  | "EMAIL_NOT_VERIFIED"
  | "PROFILE_INCOMPLETE"
  | "NOT_ENROLLED"
  | "PAYMENT_REQUIRED"
  | "ASSESSMENT_NOT_OPEN"
  | "ALREADY_ATTEMPTED";

export type AssessmentGateRequiredAction =
  | "VERIFY_EMAIL"
  | "COMPLETE_PROFILE"
  | "ENROLL"
  | "PAY"
  | "WAIT"
  | "VIEW_RESULT"
  | "START";

export interface AssessmentEnrollmentGateResponse {
  assessmentId: string;
  allowed: boolean;
  blockedReason?: AssessmentGateBlockedReason;
  requiredAction: AssessmentGateRequiredAction;
  enrollmentId?: string;
  orderId?: string;
  attemptId?: string;
  missingProfileFields?: ProfileMissingField[];
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
  roles?: string[];
}

export interface AuthenticationError {
  statusCode: number;
  message: string;
  error: string;
}

export const SEEK_ROLES = [
  "SUPER_ADMIN",
  "ORGANIZATION_ADMIN",
  "ASSESSOR",
  "VIEWER",
  "TESTER",
  "CANDIDATE",
] as const;

export type SeekRole = (typeof SEEK_ROLES)[number];

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

// =========================================================================
// Integration Service Contracts (OTP, Presigned Upload, KYC)
// =========================================================================

export interface SendOtpRequest {
  phoneNumber: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpRequest {
  phoneNumber: string;
  code: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

export interface PresignedUploadRequest {
  name: string;
  type: string;
}

export interface PresignedUploadResponse {
  uploadUrl: string;
  storageKey: string;
}

export interface VerifyIdentityRequest {
  registryNumber: string;
  fullName: string;
}

export interface VerifyIdentityResponse {
  verified: boolean;
  reason?: string | null;
}
