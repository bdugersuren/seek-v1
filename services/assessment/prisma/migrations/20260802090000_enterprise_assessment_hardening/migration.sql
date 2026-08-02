-- Enterprise assessment hardening addendum.

DO $$ BEGIN
  CREATE TYPE "OutboxStatus" AS ENUM ('PENDING', 'PUBLISHING', 'PUBLISHED', 'FAILED', 'DEAD_LETTERED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "question"
  ADD COLUMN IF NOT EXISTS "tenantId" TEXT,
  ADD COLUMN IF NOT EXISTS "updatedBy" TEXT,
  ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "deletedBy" TEXT,
  ADD COLUMN IF NOT EXISTS "deleteReason" TEXT,
  ADD COLUMN IF NOT EXISTS "sourceType" TEXT,
  ADD COLUMN IF NOT EXISTS "sourceImportId" TEXT,
  ADD COLUMN IF NOT EXISTS "visibilityScope" TEXT NOT NULL DEFAULT 'PRIVATE',
  ADD COLUMN IF NOT EXISTS "accessPolicyId" TEXT,
  ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS "qualityStatus" TEXT,
  ADD COLUMN IF NOT EXISTS "usageCountSnapshot" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "exposureCountSnapshot" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "question_version"
  ADD COLUMN IF NOT EXISTS "updatedBy" TEXT,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "languageCode" TEXT NOT NULL DEFAULT 'mn',
  ADD COLUMN IF NOT EXISTS "rubric" JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "scoringConfig" JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "negativeMarkingConfig" JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "partialCreditPolicy" JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "securityClassification" TEXT,
  ADD COLUMN IF NOT EXISTS "exposurePolicy" JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "confidentialUntil" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "checksum" TEXT,
  ADD COLUMN IF NOT EXISTS "contentHash" TEXT,
  ADD COLUMN IF NOT EXISTS "answerKeyHash" TEXT,
  ADD COLUMN IF NOT EXISTS "reviewComment" TEXT,
  ADD COLUMN IF NOT EXISTS "changeRequestReason" TEXT;

ALTER TABLE "quiz_schedule"
  ADD COLUMN IF NOT EXISTS "languageCode" TEXT NOT NULL DEFAULT 'mn',
  ADD COLUMN IF NOT EXISTS "waitingRoomOpensAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "requiredEarlyJoinMinutes" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "lateJoinPolicy" TEXT NOT NULL DEFAULT 'ALLOW_WITH_REMAINING_TIME',
  ADD COLUMN IF NOT EXISTS "lateJoinGraceSeconds" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "denyAfterSeconds" INTEGER,
  ADD COLUMN IF NOT EXISTS "resumePolicy" TEXT NOT NULL DEFAULT 'ALLOW',
  ADD COLUMN IF NOT EXISTS "maxResumeCount" INTEGER NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS "resumeGraceSeconds" INTEGER,
  ADD COLUMN IF NOT EXISTS "pausePolicy" TEXT,
  ADD COLUMN IF NOT EXISTS "pauseAllowed" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "pauseMaxSeconds" INTEGER,
  ADD COLUMN IF NOT EXISTS "pauseReasonRequired" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "admissionPolicy" JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "capacityStrategy" TEXT,
  ADD COLUMN IF NOT EXISTS "waitingQueueEnabled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "admissionBatchSize" INTEGER,
  ADD COLUMN IF NOT EXISTS "heartbeatIntervalSeconds" INTEGER NOT NULL DEFAULT 15,
  ADD COLUMN IF NOT EXISTS "autosaveIntervalSeconds" INTEGER NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS "serverUnlockMode" TEXT NOT NULL DEFAULT 'IMMEDIATE',
  ADD COLUMN IF NOT EXISTS "unlockEventLeadSeconds" INTEGER,
  ADD COLUMN IF NOT EXISTS "payloadPreloadRequired" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "proctoringProfileId" TEXT,
  ADD COLUMN IF NOT EXISTS "lockPolicyId" TEXT,
  ADD COLUMN IF NOT EXISTS "resultReleaseAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "leaderboardEnabled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "certificateEnabled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "publishedRevisionHash" TEXT,
  ADD COLUMN IF NOT EXISTS "scheduleVersion" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "topic"
  ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE IF NOT EXISTS "question_workflow_event" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "questionId" TEXT NOT NULL REFERENCES "question"("id") ON DELETE CASCADE,
  "questionVersionId" TEXT,
  "previousStatus" TEXT,
  "newStatus" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "comment" TEXT,
  "actorUserId" TEXT NOT NULL,
  "actorRole" TEXT,
  "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "metadata" JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS "manual_grading_resolution" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "manualTaskId" TEXT NOT NULL REFERENCES "manual_grading_task"("id") ON DELETE CASCADE,
  "resolutionType" TEXT NOT NULL,
  "resolvedScore" DECIMAL(10,4) NOT NULL,
  "reason" TEXT,
  "resolvedBy" TEXT NOT NULL,
  "resolvedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "metadata" JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS "result_ai_analysis" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "assessmentResultId" TEXT NOT NULL REFERENCES "assessment_result"("id") ON DELETE CASCADE,
  "modelName" TEXT NOT NULL,
  "modelVersion" TEXT,
  "promptVersion" TEXT,
  "summary" TEXT NOT NULL,
  "strengths" JSONB NOT NULL DEFAULT '[]',
  "weaknesses" JSONB NOT NULL DEFAULT '[]',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "confidence" DECIMAL(7,4),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "result_access_log" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "publicationId" TEXT NOT NULL REFERENCES "result_publication"("id") ON DELETE CASCADE,
  "actorUserId" TEXT,
  "channel" TEXT NOT NULL DEFAULT 'WEB',
  "ipHash" TEXT,
  "userAgentHash" TEXT,
  "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "metadata" JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS "reporting_attempt_fact" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "attemptId" TEXT NOT NULL UNIQUE,
  "resultId" TEXT,
  "tenantId" TEXT,
  "scheduleId" TEXT NOT NULL,
  "quizId" TEXT NOT NULL,
  "quizRevisionId" TEXT NOT NULL,
  "candidateId" TEXT NOT NULL,
  "organizationId" TEXT,
  "regionId" TEXT,
  "districtId" TEXT,
  "schoolId" TEXT,
  "classId" TEXT,
  "teacherId" TEXT,
  "assessmentContextId" TEXT,
  "startedAt" TIMESTAMP(3),
  "submittedAt" TIMESTAMP(3),
  "durationSeconds" INTEGER,
  "finalScore" DECIMAL(14,4),
  "maxPossibleScore" DECIMAL(14,4),
  "percentage" DECIMAL(7,4),
  "passStatus" TEXT,
  "status" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "ix_question_workflow_question_time"
  ON "question_workflow_event"("questionId", "occurredAt");
CREATE INDEX IF NOT EXISTS "ix_question_workflow_status_time"
  ON "question_workflow_event"("newStatus", "occurredAt");
CREATE INDEX IF NOT EXISTS "ix_assignment_user_status_schedule"
  ON "quiz_user_assignment"("userId", "status", "scheduleId");
CREATE INDEX IF NOT EXISTS "ix_result_attempt_status_version"
  ON "assessment_result"("attemptId", "status", "resultVersion");
CREATE INDEX IF NOT EXISTS "ix_result_access_publication_time"
  ON "result_access_log"("publicationId", "viewedAt");
CREATE INDEX IF NOT EXISTS "ix_reporting_attempt_schedule_status"
  ON "reporting_attempt_fact"("scheduleId", "status");
CREATE INDEX IF NOT EXISTS "ix_reporting_attempt_region_school"
  ON "reporting_attempt_fact"("regionId", "districtId", "schoolId");
