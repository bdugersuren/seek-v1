-- Enterprise runtime hardening addendum.
-- Prisma creates the logical schema; this migration adds operational tables,
-- idempotency columns, and PostgreSQL-native high-write indexes.

ALTER TABLE "attempt_eligibility_snapshot"
  ADD COLUMN IF NOT EXISTS "tenantId" TEXT,
  ADD COLUMN IF NOT EXISTS "organizationId" TEXT,
  ADD COLUMN IF NOT EXISTS "regionId" TEXT,
  ADD COLUMN IF NOT EXISTS "districtId" TEXT,
  ADD COLUMN IF NOT EXISTS "schoolId" TEXT,
  ADD COLUMN IF NOT EXISTS "classId" TEXT,
  ADD COLUMN IF NOT EXISTS "candidateDisplayNameSnapshot" TEXT,
  ADD COLUMN IF NOT EXISTS "candidateExternalIdHash" TEXT,
  ADD COLUMN IF NOT EXISTS "attemptsUsedSnapshot" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "paymentEntitlementSnapshot" JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "termsRequired" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "waitingRoomOpensAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "requiredEarlyJoinMinutes" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "admissionStatus" TEXT,
  ADD COLUMN IF NOT EXISTS "admissionTokenHash" TEXT,
  ADD COLUMN IF NOT EXISTS "queuePosition" INTEGER,
  ADD COLUMN IF NOT EXISTS "snapshotHash" TEXT,
  ADD COLUMN IF NOT EXISTS "signedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "signingKeyId" TEXT;

ALTER TABLE "quiz_attempt"
  ADD COLUMN IF NOT EXISTS "tenantId" TEXT,
  ADD COLUMN IF NOT EXISTS "partitionKey" TEXT,
  ADD COLUMN IF NOT EXISTS "regionId" TEXT,
  ADD COLUMN IF NOT EXISTS "createdFromRequestId" TEXT,
  ADD COLUMN IF NOT EXISTS "idempotencyKey" TEXT,
  ADD COLUMN IF NOT EXISTS "rowVersion" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS "serverStartedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "startedByClientAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "resumeCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "lastResumeAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "pauseCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "pausedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "pauseReason" TEXT,
  ADD COLUMN IF NOT EXISTS "heartbeatMissCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "networkLatencyMs" INTEGER,
  ADD COLUMN IF NOT EXISTS "lastRoundTripMs" INTEGER,
  ADD COLUMN IF NOT EXISTS "clientClockSkewMs" INTEGER,
  ADD COLUMN IF NOT EXISTS "clientPlatform" TEXT,
  ADD COLUMN IF NOT EXISTS "browserName" TEXT,
  ADD COLUMN IF NOT EXISTS "browserVersion" TEXT,
  ADD COLUMN IF NOT EXISTS "osName" TEXT,
  ADD COLUMN IF NOT EXISTS "deviceModel" TEXT,
  ADD COLUMN IF NOT EXISTS "deviceFingerprintHash" TEXT,
  ADD COLUMN IF NOT EXISTS "lockPolicyDecisionId" TEXT,
  ADD COLUMN IF NOT EXISTS "invalidatedBy" TEXT,
  ADD COLUMN IF NOT EXISTS "invalidatedReason" TEXT;

ALTER TABLE "question_response_event"
  ADD COLUMN IF NOT EXISTS "partitionKey" TEXT,
  ADD COLUMN IF NOT EXISTS "eventType" TEXT NOT NULL DEFAULT 'ANSWER_CHANGED',
  ADD COLUMN IF NOT EXISTS "payloadChecksum" TEXT,
  ADD COLUMN IF NOT EXISTS "requestSignature" TEXT,
  ADD COLUMN IF NOT EXISTS "nonce" TEXT,
  ADD COLUMN IF NOT EXISTS "serverAppliedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "applyStatus" TEXT NOT NULL DEFAULT 'APPLIED',
  ADD COLUMN IF NOT EXISTS "rejectReason" TEXT,
  ADD COLUMN IF NOT EXISTS "ipHash" TEXT,
  ADD COLUMN IF NOT EXISTS "userAgentHash" TEXT,
  ADD COLUMN IF NOT EXISTS "deviceFingerprintHash" TEXT;

ALTER TABLE "question_response"
  ADD COLUMN IF NOT EXISTS "encryptedAnswerValue" BYTEA,
  ADD COLUMN IF NOT EXISTS "answerChecksum" TEXT,
  ADD COLUMN IF NOT EXISTS "answerStatus" TEXT NOT NULL DEFAULT 'SAVED',
  ADD COLUMN IF NOT EXISTS "rowVersion" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS "timeSpentMsServer" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "focusTimeMs" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "blurTimeMs" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "lastClientSavedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "clientClockSkewMs" INTEGER,
  ADD COLUMN IF NOT EXISTS "conflictCount" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "quiz_violation"
  ADD COLUMN IF NOT EXISTS "idempotencyKey" TEXT,
  ADD COLUMN IF NOT EXISTS "evidenceHash" TEXT,
  ADD COLUMN IF NOT EXISTS "screenshotFileId" TEXT,
  ADD COLUMN IF NOT EXISTS "proctoringSessionId" TEXT,
  ADD COLUMN IF NOT EXISTS "policyRuleId" TEXT,
  ADD COLUMN IF NOT EXISTS "thresholdBefore" DECIMAL(14,4),
  ADD COLUMN IF NOT EXISTS "thresholdAfter" DECIMAL(14,4),
  ADD COLUMN IF NOT EXISTS "decisionStatus" TEXT NOT NULL DEFAULT 'RECORDED',
  ADD COLUMN IF NOT EXISTS "reviewedBy" TEXT,
  ADD COLUMN IF NOT EXISTS "reviewedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "reviewOutcome" TEXT;

ALTER TABLE "attempt_submission"
  ADD COLUMN IF NOT EXISTS "submitReason" TEXT,
  ADD COLUMN IF NOT EXISTS "clientSubmittedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "serverReceivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "clientClockSkewMs" INTEGER,
  ADD COLUMN IF NOT EXISTS "finalAnswerCount" INTEGER,
  ADD COLUMN IF NOT EXISTS "finalMarkedCount" INTEGER,
  ADD COLUMN IF NOT EXISTS "finalDurationMs" INTEGER,
  ADD COLUMN IF NOT EXISTS "requestSignature" TEXT,
  ADD COLUMN IF NOT EXISTS "receiptNumber" TEXT,
  ADD COLUMN IF NOT EXISTS "receiptPayloadHash" TEXT,
  ADD COLUMN IF NOT EXISTS "gradingJobId" TEXT;

ALTER TABLE "attempt_question"
  ADD COLUMN IF NOT EXISTS "sectionTitleSnapshot" TEXT,
  ADD COLUMN IF NOT EXISTS "sectionOrderIndex" INTEGER,
  ADD COLUMN IF NOT EXISTS "questionCodeSnapshot" TEXT,
  ADD COLUMN IF NOT EXISTS "instructionSnapshot" JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "deliveredSequence" INTEGER,
  ADD COLUMN IF NOT EXISTS "deliveryStatus" TEXT NOT NULL DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS "isRequired" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "negativeScoreSnapshot" DECIMAL(10,4),
  ADD COLUMN IF NOT EXISTS "partialCreditPolicySnapshot" JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "contentHash" TEXT,
  ADD COLUMN IF NOT EXISTS "optionsHash" TEXT,
  ADD COLUMN IF NOT EXISTS "mediaHash" TEXT,
  ADD COLUMN IF NOT EXISTS "clientDecryptAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "renderedAt" TIMESTAMP(3);

ALTER TABLE "attempt_state_snapshot"
  ADD COLUMN IF NOT EXISTS "encryptedSnapshot" BYTEA,
  ADD COLUMN IF NOT EXISTS "snapshotHash" TEXT,
  ADD COLUMN IF NOT EXISTS "signature" TEXT,
  ADD COLUMN IF NOT EXISTS "keyId" TEXT,
  ADD COLUMN IF NOT EXISTS "lastHeartbeatAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "lastOnlineAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "pendingSubmitReason" TEXT,
  ADD COLUMN IF NOT EXISTS "offlineSince" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "snapshotSource" TEXT NOT NULL DEFAULT 'AUTOSAVE';

CREATE TABLE IF NOT EXISTS "attempt_lifecycle_event" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "attemptId" TEXT NOT NULL REFERENCES "quiz_attempt"("id") ON DELETE CASCADE,
  "previousStatus" TEXT,
  "newStatus" TEXT NOT NULL,
  "reason" TEXT,
  "actorType" TEXT NOT NULL,
  "actorId" TEXT,
  "idempotencyKey" TEXT,
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "attempt_heartbeat_event" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "attemptId" TEXT NOT NULL REFERENCES "quiz_attempt"("id") ON DELETE CASCADE,
  "clientInstanceId" TEXT,
  "clientNow" TIMESTAMP(3),
  "serverReceivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "serverRespondedAt" TIMESTAMP(3),
  "visible" BOOLEAN NOT NULL,
  "fullscreen" BOOLEAN NOT NULL,
  "online" BOOLEAN NOT NULL DEFAULT true,
  "clientClockSkewMs" INTEGER,
  "roundTripMs" INTEGER,
  "networkType" TEXT,
  "remainingSeconds" INTEGER NOT NULL,
  "status" TEXT NOT NULL,
  "warning" TEXT,
  "requestSignature" TEXT,
  "metadata" JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS "attempt_instruction_acknowledgement" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "attemptId" TEXT NOT NULL REFERENCES "quiz_attempt"("id") ON DELETE CASCADE,
  "instructionHash" TEXT NOT NULL,
  "policyVersion" TEXT NOT NULL,
  "acceptedBy" TEXT NOT NULL,
  "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "clientIpHash" TEXT,
  "userAgentHash" TEXT,
  "metadata" JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS "attempt_navigation_event" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "attemptId" TEXT NOT NULL REFERENCES "quiz_attempt"("id") ON DELETE CASCADE,
  "fromAttemptQuestionId" TEXT,
  "toAttemptQuestionId" TEXT NOT NULL,
  "clientSequence" INTEGER NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "saveRequired" BOOLEAN NOT NULL DEFAULT false,
  "saveSucceeded" BOOLEAN,
  "clientOccurredAt" TIMESTAMP(3),
  "serverReceivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "attempt_lock_decision" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "attemptId" TEXT NOT NULL REFERENCES "quiz_attempt"("id") ON DELETE CASCADE,
  "policyRuleId" TEXT,
  "violationCount" INTEGER NOT NULL,
  "decision" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "decidedBy" TEXT NOT NULL,
  "decidedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "previousStatus" TEXT NOT NULL,
  "newStatus" TEXT NOT NULL,
  "metadata" JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS "attempt_payload_receipt" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "attemptId" TEXT NOT NULL REFERENCES "quiz_attempt"("id") ON DELETE CASCADE,
  "payloadHash" TEXT NOT NULL,
  "keyId" TEXT,
  "receiptType" TEXT NOT NULL DEFAULT 'PRELOAD',
  "deliveredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "acknowledgedAt" TIMESTAMP(3),
  "clientInstanceId" TEXT,
  "clientIpHash" TEXT,
  "userAgentHash" TEXT,
  "metadata" JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS "runtime_delivery_event" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "attemptId" TEXT NOT NULL REFERENCES "quiz_attempt"("id") ON DELETE CASCADE,
  "eventType" TEXT NOT NULL,
  "deliveryKey" TEXT,
  "payloadHash" TEXT,
  "keyId" TEXT,
  "deliveredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "acknowledgedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "clientInstanceId" TEXT,
  "metadata" JSONB NOT NULL DEFAULT '{}'
);

CREATE UNIQUE INDEX IF NOT EXISTS "uq_attempt_lifecycle_idempotency"
  ON "attempt_lifecycle_event"("attemptId", "idempotencyKey")
  WHERE "idempotencyKey" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "ix_attempt_lifecycle_attempt_time"
  ON "attempt_lifecycle_event"("attemptId", "occurredAt");
CREATE INDEX IF NOT EXISTS "ix_heartbeat_attempt_time"
  ON "attempt_heartbeat_event"("attemptId", "serverReceivedAt");
CREATE INDEX IF NOT EXISTS "ix_heartbeat_status_time"
  ON "attempt_heartbeat_event"("status", "serverReceivedAt");
CREATE UNIQUE INDEX IF NOT EXISTS "uq_instruction_ack_attempt_hash"
  ON "attempt_instruction_acknowledgement"("attemptId", "instructionHash");
CREATE UNIQUE INDEX IF NOT EXISTS "uq_navigation_idempotency"
  ON "attempt_navigation_event"("attemptId", "idempotencyKey");
CREATE INDEX IF NOT EXISTS "ix_navigation_attempt_time"
  ON "attempt_navigation_event"("attemptId", "serverReceivedAt");
CREATE INDEX IF NOT EXISTS "ix_lock_decision_attempt_time"
  ON "attempt_lock_decision"("attemptId", "decidedAt");
CREATE UNIQUE INDEX IF NOT EXISTS "uq_payload_receipt"
  ON "attempt_payload_receipt"("attemptId", "payloadHash", "receiptType");
CREATE UNIQUE INDEX IF NOT EXISTS "uq_runtime_delivery"
  ON "runtime_delivery_event"("attemptId", "eventType", "deliveryKey");

CREATE INDEX IF NOT EXISTS "ix_attempt_schedule_candidate_status"
  ON "quiz_attempt"("scheduleId", "candidateId", "status");
CREATE INDEX IF NOT EXISTS "ix_attempt_partition_status_expiry"
  ON "quiz_attempt"("partitionKey", "status", "expiresAt");
CREATE INDEX IF NOT EXISTS "ix_response_event_attempt_sequence"
  ON "question_response_event"("attemptId", "clientInstanceId", "clientSequence");
CREATE INDEX IF NOT EXISTS "ix_response_event_partition_received"
  ON "question_response_event"("partitionKey", "serverReceivedAt");
CREATE INDEX IF NOT EXISTS "ix_violation_attempt_type_time"
  ON "quiz_violation"("attemptId", "violationType", "serverReceivedAt");
CREATE INDEX IF NOT EXISTS "ix_submission_status_requested"
  ON "attempt_submission"("resultStatus", "requestedAt");

-- Native partitioning note:
-- Existing Prisma-managed tables cannot be converted to partitioned tables safely
-- in a generic migration. For production rollout, create future high-write event
-- tables as partitioned tables before data load, or perform an online copy/swap.
-- Recommended keys: hash(scheduleId/partitionKey) plus monthly time partitions.
