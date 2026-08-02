-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('CREATED', 'IN_PROGRESS', 'SUBMITTED', 'EXPIRED', 'LOCKED', 'CANCELLED', 'INVALIDATED');

-- CreateEnum
CREATE TYPE "SubmissionSource" AS ENUM ('USER', 'AUTO_EXPIRE', 'ADMIN', 'SYSTEM_RECOVERY');

-- CreateEnum
CREATE TYPE "ViolationSeverity" AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "SubmissionResultStatus" AS ENUM ('ACCEPTED', 'REJECTED', 'DUPLICATE');

-- CreateEnum
CREATE TYPE "EligibilityStatus" AS ENUM ('PREPARED', 'ACTIVE', 'REVOKED', 'EXPIRED');

-- CreateTable
CREATE TABLE "attempt_eligibility_snapshot" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "quizRevisionId" TEXT NOT NULL,
    "status" "EligibilityStatus" NOT NULL DEFAULT 'PREPARED',
    "availableFrom" TIMESTAMP(3) NOT NULL,
    "availableUntil" TIMESTAMP(3) NOT NULL,
    "durationLimitSeconds" INTEGER NOT NULL,
    "maxAttempts" INTEGER NOT NULL,
    "endTimePolicy" TEXT NOT NULL,
    "accessMode" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Ulaanbaatar',
    "scheduleSnapshot" JSONB NOT NULL,
    "runtimePolicySnapshot" JSONB NOT NULL DEFAULT '{}',
    "proctoringPolicySnapshot" JSONB NOT NULL DEFAULT '{}',
    "resultPolicySnapshot" JSONB NOT NULL DEFAULT '{}',
    "accessPolicySnapshot" JSONB NOT NULL DEFAULT '{}',
    "eligibilityChecksum" TEXT NOT NULL,
    "sourceVersion" INTEGER NOT NULL DEFAULT 1,
    "preparedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activatedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "revokeReason" TEXT,
    "expiresAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attempt_eligibility_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_attempt" (
    "id" TEXT NOT NULL,
    "eligibilitySnapshotId" TEXT,
    "scheduleId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "quizRevisionId" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "attemptNumber" INTEGER NOT NULL,
    "status" "AttemptStatus" NOT NULL DEFAULT 'CREATED',
    "statusReason" TEXT,
    "durationLimitSeconds" INTEGER NOT NULL,
    "warningsCount" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "lockedAt" TIMESTAMP(3),
    "lockReason" TEXT,
    "lastHeartbeatAt" TIMESTAMP(3),
    "clientInstanceId" TEXT,
    "clientIp" TEXT,
    "userAgent" TEXT,
    "runtimeVersion" TEXT,
    "submissionChecksum" TEXT,
    "submittedSource" "SubmissionSource",
    "scheduleSnapshot" JSONB NOT NULL DEFAULT '{}',
    "runtimePolicySnapshot" JSONB NOT NULL DEFAULT '{}',
    "proctoringPolicySnapshot" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_attempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attempt_question" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "questionVersionId" TEXT NOT NULL,
    "quizRevisionSectionId" TEXT NOT NULL,
    "topicQuestionClassificationId" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "maxScoreSnapshot" DECIMAL(10,4) NOT NULL,
    "minScoreSnapshot" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "timeLimitSecondsSnapshot" INTEGER,
    "questionTypeCodeSnapshot" TEXT NOT NULL,
    "contentSnapshot" JSONB NOT NULL,
    "presentationConfigSnapshot" JSONB NOT NULL DEFAULT '{}',
    "optionsSnapshot" JSONB NOT NULL DEFAULT '[]',
    "mediaSnapshot" JSONB NOT NULL DEFAULT '[]',
    "classificationSnapshot" JSONB DEFAULT '{}',
    "gradingConfigCipher" BYTEA,
    "gradingConfigKeyId" TEXT,
    "answerKeyVersionHash" TEXT,
    "optionsOrder" JSONB NOT NULL DEFAULT '[]',
    "selectionReason" JSONB NOT NULL DEFAULT '{}',
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attempt_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_response" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "attemptQuestionId" TEXT NOT NULL,
    "answerValue" JSONB NOT NULL,
    "serverVersion" INTEGER NOT NULL DEFAULT 1,
    "lastClientSequence" INTEGER NOT NULL,
    "clientTimeSpentMs" INTEGER NOT NULL DEFAULT 0,
    "firstAnsweredAt" TIMESTAMP(3),
    "lastAnsweredAt" TIMESTAMP(3),
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSourceEventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_response_event" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "attemptQuestionId" TEXT NOT NULL,
    "clientInstanceId" TEXT NOT NULL,
    "clientSequence" INTEGER NOT NULL,
    "baseServerVersion" INTEGER,
    "idempotencyKey" TEXT NOT NULL,
    "answerValue" JSONB NOT NULL,
    "clientOccurredAt" TIMESTAMP(3),
    "serverReceivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sourceEventId" TEXT,

    CONSTRAINT "question_response_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_violation" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "violationType" TEXT NOT NULL,
    "severity" "ViolationSeverity" NOT NULL DEFAULT 'WARNING',
    "clientInstanceId" TEXT,
    "clientSequence" INTEGER,
    "clientOccurredAt" TIMESTAMP(3),
    "serverReceivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actionTaken" TEXT,
    "messageCode" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "quiz_violation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attempt_state_snapshot" (
    "attemptId" TEXT NOT NULL,
    "snapshotVersion" INTEGER NOT NULL DEFAULT 1,
    "answers" JSONB NOT NULL DEFAULT '{}',
    "markedForReview" JSONB NOT NULL DEFAULT '{}',
    "currentAttemptQuestionId" TEXT,
    "lastClientSequence" INTEGER,
    "lastResponseServerVersion" INTEGER,
    "navigationState" JSONB NOT NULL DEFAULT '{}',
    "checksum" TEXT,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attempt_state_snapshot_pkey" PRIMARY KEY ("attemptId")
);

-- CreateTable
CREATE TABLE "attempt_submission" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "submissionVersion" INTEGER NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "source" "SubmissionSource" NOT NULL,
    "finalSnapshotVersion" INTEGER,
    "submissionChecksum" TEXT NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "resultStatus" "SubmissionResultStatus" NOT NULL,
    "rejectionReason" TEXT,

    CONSTRAINT "attempt_submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbox_event" (
    "id" TEXT NOT NULL,
    "aggregateType" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "availableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),
    "lastError" TEXT,

    CONSTRAINT "outbox_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "attempt_eligibility_snapshot_candidateId_status_availableFr_idx" ON "attempt_eligibility_snapshot"("candidateId", "status", "availableFrom");

-- CreateIndex
CREATE INDEX "attempt_eligibility_snapshot_scheduleId_status_idx" ON "attempt_eligibility_snapshot"("scheduleId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "attempt_eligibility_snapshot_scheduleId_candidateId_key" ON "attempt_eligibility_snapshot"("scheduleId", "candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "attempt_eligibility_snapshot_assignmentId_key" ON "attempt_eligibility_snapshot"("assignmentId");

-- CreateIndex
CREATE INDEX "quiz_attempt_candidateId_quizId_idx" ON "quiz_attempt"("candidateId", "quizId");

-- CreateIndex
CREATE INDEX "quiz_attempt_scheduleId_status_idx" ON "quiz_attempt"("scheduleId", "status");

-- CreateIndex
CREATE INDEX "quiz_attempt_status_expiresAt_idx" ON "quiz_attempt"("status", "expiresAt");

-- CreateIndex
CREATE INDEX "quiz_attempt_eligibilitySnapshotId_idx" ON "quiz_attempt"("eligibilitySnapshotId");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_attempt_assignmentId_attemptNumber_key" ON "quiz_attempt"("assignmentId", "attemptNumber");

-- CreateIndex
CREATE INDEX "attempt_question_attemptId_questionVersionId_idx" ON "attempt_question"("attemptId", "questionVersionId");

-- CreateIndex
CREATE INDEX "attempt_question_topicQuestionClassificationId_idx" ON "attempt_question"("topicQuestionClassificationId");

-- CreateIndex
CREATE UNIQUE INDEX "attempt_question_attemptId_orderIndex_key" ON "attempt_question"("attemptId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "question_response_attemptQuestionId_key" ON "question_response"("attemptQuestionId");

-- CreateIndex
CREATE INDEX "question_response_attemptId_idx" ON "question_response"("attemptId");

-- CreateIndex
CREATE INDEX "question_response_event_attemptId_serverReceivedAt_idx" ON "question_response_event"("attemptId", "serverReceivedAt");

-- CreateIndex
CREATE INDEX "question_response_event_attemptQuestionId_idx" ON "question_response_event"("attemptQuestionId");

-- CreateIndex
CREATE UNIQUE INDEX "question_response_event_attemptId_clientInstanceId_clientSe_key" ON "question_response_event"("attemptId", "clientInstanceId", "clientSequence");

-- CreateIndex
CREATE UNIQUE INDEX "question_response_event_attemptId_idempotencyKey_key" ON "question_response_event"("attemptId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "quiz_violation_attemptId_serverReceivedAt_idx" ON "quiz_violation"("attemptId", "serverReceivedAt");

-- CreateIndex
CREATE INDEX "quiz_violation_violationType_severity_idx" ON "quiz_violation"("violationType", "severity");

-- CreateIndex
CREATE INDEX "attempt_submission_attemptId_requestedAt_idx" ON "attempt_submission"("attemptId", "requestedAt");

-- CreateIndex
CREATE UNIQUE INDEX "attempt_submission_attemptId_submissionVersion_key" ON "attempt_submission"("attemptId", "submissionVersion");

-- CreateIndex
CREATE UNIQUE INDEX "attempt_submission_attemptId_idempotencyKey_key" ON "attempt_submission"("attemptId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "outbox_event_status_availableAt_idx" ON "outbox_event"("status", "availableAt");

-- CreateIndex
CREATE INDEX "outbox_event_aggregateType_aggregateId_idx" ON "outbox_event"("aggregateType", "aggregateId");

-- AddForeignKey
ALTER TABLE "quiz_attempt" ADD CONSTRAINT "quiz_attempt_eligibilitySnapshotId_fkey" FOREIGN KEY ("eligibilitySnapshotId") REFERENCES "attempt_eligibility_snapshot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_question" ADD CONSTRAINT "attempt_question_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "quiz_attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_response" ADD CONSTRAINT "question_response_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "quiz_attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_response" ADD CONSTRAINT "question_response_attemptQuestionId_fkey" FOREIGN KEY ("attemptQuestionId") REFERENCES "attempt_question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_response_event" ADD CONSTRAINT "question_response_event_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "quiz_attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_response_event" ADD CONSTRAINT "question_response_event_attemptQuestionId_fkey" FOREIGN KEY ("attemptQuestionId") REFERENCES "attempt_question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_violation" ADD CONSTRAINT "quiz_violation_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "quiz_attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_state_snapshot" ADD CONSTRAINT "attempt_state_snapshot_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "quiz_attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_submission" ADD CONSTRAINT "attempt_submission_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "quiz_attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

