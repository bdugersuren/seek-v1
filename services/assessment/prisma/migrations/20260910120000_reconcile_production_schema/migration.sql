-- Reconcile previously unversioned schema changes without deleting historical values.
BEGIN;
-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'ORDERING', 'MATCHING', 'SHORT_TEXT', 'FILL_BLANK', 'MATRIX', 'NUMERIC', 'LIKERT', 'SJT', 'CASE_BUNDLE', 'ESSAY');

-- AlterEnum
ALTER TYPE "QuizLifecycleStatus" ADD VALUE 'READY';

-- DropForeignKey
ALTER TABLE "manual_grading_resolution" DROP CONSTRAINT "manual_grading_resolution_manualTaskId_fkey";

-- DropForeignKey
-- Keep legacy type references for historical data.

-- DropForeignKey
ALTER TABLE "question_workflow_event" DROP CONSTRAINT "question_workflow_event_questionId_fkey";

-- DropForeignKey
ALTER TABLE "result_access_log" DROP CONSTRAINT "result_access_log_publicationId_fkey";

-- DropForeignKey
ALTER TABLE "result_ai_analysis" DROP CONSTRAINT "result_ai_analysis_assessmentResultId_fkey";

-- DropForeignKey
-- Keep legacy cognitive-level references for historical data.

-- DropIndex
DROP INDEX "ix_result_attempt_status_version";

-- DropIndex
DROP INDEX "question_version_typeId_idx";

-- DropIndex
DROP INDEX "topic_code_key";

-- DropIndex
DROP INDEX "topic_question_classification_topicId_questionId_assessment_key";

-- AlterTable
ALTER TABLE "assessment_context" ADD COLUMN     "assessmentType" TEXT,
ADD COLUMN     "educationLevel" TEXT,
ADD COLUMN     "gradeLevel" TEXT,
ADD COLUMN     "jurisdictionLevel" TEXT,
ADD COLUMN     "languagePolicy" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "ownerOrganizationId" TEXT,
ADD COLUMN     "regionId" TEXT,
ADD COLUMN     "reportingDimensionSetId" TEXT,
ADD COLUMN     "subjectCode" TEXT,
ADD COLUMN     "tenantId" TEXT;

-- AlterTable
ALTER TABLE "assessment_result" ADD COLUMN     "aiAnalysis" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "candidateId" TEXT,
ADD COLUMN     "classId" TEXT,
ADD COLUMN     "cohortId" TEXT,
ADD COLUMN     "cohortPercentile" DECIMAL(7,4),
ADD COLUMN     "districtId" TEXT,
ADD COLUMN     "durationSeconds" INTEGER,
ADD COLUMN     "negativeMarks" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "quizId" TEXT,
ADD COLUMN     "quizRevisionId" TEXT,
ADD COLUMN     "rank" INTEGER,
ADD COLUMN     "recommendation" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "regionId" TEXT,
ADD COLUMN     "scheduleId" TEXT,
ADD COLUMN     "schoolId" TEXT,
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "submittedAt" TIMESTAMP(3),
ADD COLUMN     "weaknessSummary" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "attempt_question_score" ADD COLUMN     "answeredAt" TIMESTAMP(3),
ADD COLUMN     "graderConfidence" DECIMAL(7,4),
ADD COLUMN     "moderationRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "negativeScore" DECIMAL(10,4) NOT NULL DEFAULT 0,
ADD COLUMN     "penaltyReason" TEXT,
ADD COLUMN     "rubricLevelId" TEXT,
ADD COLUMN     "scoreBand" TEXT,
ADD COLUMN     "timeSpentMs" INTEGER;

-- AlterTable
ALTER TABLE "audience_level" ADD COLUMN     "effectiveFrom" TIMESTAMP(3),
ADD COLUMN     "effectiveTo" TIMESTAMP(3),
ADD COLUMN     "externalCode" TEXT,
ADD COLUMN     "levelKind" TEXT;

-- AlterTable
ALTER TABLE "audience_type" ADD COLUMN     "tenantId" TEXT;

-- AlterTable
ALTER TABLE "cognitive_framework" ADD COLUMN     "frameworkVersion" TEXT;

-- AlterTable
ALTER TABLE "cognitive_level" ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "reportBucket" TEXT;

-- AlterTable
ALTER TABLE "competence_framework" ADD COLUMN     "externalStandardRef" TEXT,
ADD COLUMN     "jurisdiction" TEXT,
ADD COLUMN     "ownerOrganizationId" TEXT,
ADD COLUMN     "proficiencyScaleId" TEXT,
ADD COLUMN     "tenantId" TEXT;

-- AlterTable
ALTER TABLE "difficulty_level" ADD COLUMN     "color" TEXT,
ADD COLUMN     "maxAbility" DECIMAL(10,4),
ADD COLUMN     "minAbility" DECIMAL(10,4),
ADD COLUMN     "numericValue" DECIMAL(10,4),
ADD COLUMN     "reportOrder" INTEGER;

-- AlterTable
ALTER TABLE "grading_job" ADD COLUMN     "correlationId" TEXT,
ADD COLUMN     "idempotencyKey" TEXT,
ADD COLUMN     "lockExpiresAt" TIMESTAMP(3),
ADD COLUMN     "lockedAt" TIMESTAMP(3),
ADD COLUMN     "maxRetries" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "nextRetryAt" TIMESTAMP(3),
ADD COLUMN     "partitionKey" TEXT,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "queueName" TEXT,
ADD COLUMN     "retryCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "traceId" TEXT,
ADD COLUMN     "workerId" TEXT;

-- AlterTable
ALTER TABLE "manual_grading_task" ADD COLUMN     "anonymizedCandidateKey" TEXT,
ADD COLUMN     "appealId" TEXT,
ADD COLUMN     "escalatedAt" TIMESTAMP(3),
ADD COLUMN     "escalatedTo" TEXT,
ADD COLUMN     "regradeReason" TEXT,
ADD COLUMN     "slaBreachedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "outbox_event" ADD COLUMN     "causationId" TEXT,
ADD COLUMN     "correlationId" TEXT,
ADD COLUMN     "deadLetteredAt" TIMESTAMP(3),
ADD COLUMN     "eventId" TEXT,
ADD COLUMN     "idempotencyKey" TEXT,
ADD COLUMN     "lastAttemptAt" TIMESTAMP(3),
ADD COLUMN     "lockExpiresAt" TIMESTAMP(3),
ADD COLUMN     "lockedAt" TIMESTAMP(3),
ADD COLUMN     "lockedBy" TEXT,
ADD COLUMN     "maxRetries" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "nextRetryAt" TIMESTAMP(3),
ADD COLUMN     "partitionKey" TEXT,
ADD COLUMN     "schemaVersion" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "traceId" TEXT,
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" TYPE "OutboxStatus" USING "status"::"OutboxStatus",
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "question" ADD COLUMN     "parentId" TEXT;

-- AlterTable
ALTER TABLE "question_competence_score_contribution" ADD COLUMN     "cognitiveLevelId" TEXT,
ADD COLUMN     "confidence" DECIMAL(7,4),
ADD COLUMN     "difficultyLevelId" TEXT,
ADD COLUMN     "evidenceStrength" DECIMAL(7,4),
ADD COLUMN     "topicId" TEXT;

-- AlterTable
ALTER TABLE "question_media" ADD COLUMN     "accessPolicy" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "cdnUrl" TEXT,
ADD COLUMN     "checksum" TEXT,
ADD COLUMN     "copyrightOwner" TEXT,
ADD COLUMN     "durationMs" INTEGER,
ADD COLUMN     "fileId" TEXT,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "languageCode" TEXT,
ADD COLUMN     "license" TEXT,
ADD COLUMN     "signedUrlPolicy" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "sizeBytes" BIGINT,
ADD COLUMN     "transcodingStatus" TEXT,
ADD COLUMN     "width" INTEGER;

-- AlterTable
ALTER TABLE "question_option_version" ADD COLUMN     "contentHtml" TEXT,
ADD COLUMN     "contentJson" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "isCorrect" BOOLEAN,
ADD COLUMN     "mediaRefs" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "negativeScore" DECIMAL(10,4),
ADD COLUMN     "score" DECIMAL(10,4);

-- AlterTable
ALTER TABLE "question_version" ADD COLUMN "feedbackCorrect" TEXT,
ADD COLUMN "feedbackIncorrect" TEXT,
ADD COLUMN "type" "QuestionType",
ALTER COLUMN "typeId" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;
-- Unknown legacy codes fail the transaction instead of silently changing question semantics.
UPDATE "question_version" q SET "type" = UPPER(REPLACE(t."code", '-', '_'))::"QuestionType",
"feedbackCorrect" = q."feedbackCorrectly", "feedbackIncorrect" = q."feedbackIncorrectly"
FROM "question_type" t WHERE t."id" = q."typeId";
ALTER TABLE "question_version" ALTER COLUMN "type" SET NOT NULL;

-- AlterTable
ALTER TABLE "quiz" ADD COLUMN     "assessmentType" TEXT,
ADD COLUMN     "catalogStatus" TEXT NOT NULL DEFAULT 'HIDDEN',
ADD COLUMN     "languageCode" TEXT NOT NULL DEFAULT 'mn',
ADD COLUMN     "ownerOrganizationId" TEXT,
ADD COLUMN     "tenantId" TEXT,
ADD COLUMN     "updatedBy" TEXT,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "visibilityStatus" TEXT NOT NULL DEFAULT 'PRIVATE';

-- AlterTable
ALTER TABLE "quiz_audience_rule" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "effectiveFrom" TIMESTAMP(3),
ADD COLUMN     "effectiveTo" TIMESTAMP(3),
ADD COLUMN     "eligibilityEvaluationMode" TEXT,
ADD COLUMN     "exclude" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ruleSnapshotHash" TEXT,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "quiz_revision" ADD COLUMN     "appealPolicy" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "approvalComment" TEXT,
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "certificatePolicy" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "devicePolicy" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "languageCode" TEXT NOT NULL DEFAULT 'mn',
ADD COLUMN     "leaderboardPolicy" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "lockdownBrowserPolicy" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "negativeMarkingPolicy" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "questionManifestHash" TEXT,
ADD COLUMN     "roundingPolicy" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "shuffleSections" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "solutionVisibilityPolicy" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "totalMaxScore" DECIMAL(14,4),
ADD COLUMN     "totalQuestionCount" INTEGER;

-- AlterTable
ALTER TABLE "quiz_revision_question" ADD COLUMN     "answerKeyHash" TEXT,
ADD COLUMN     "cognitiveSnapshot" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "competenceSnapshot" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "contentHash" TEXT,
ADD COLUMN     "difficultySnapshot" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "questionTypeCodeSnapshot" TEXT,
ADD COLUMN     "rubricSnapshot" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "topicSnapshot" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "quiz_revision_section" ADD COLUMN     "displayInstruction" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "durationSeconds" INTEGER,
ADD COLUMN     "navigationPolicy" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "shuffleQuestions" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "quiz_schedule_payment_policy" ADD COLUMN     "couponPolicy" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "invoiceRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentProvider" TEXT,
ADD COLUMN     "settlementAccountId" TEXT,
ADD COLUMN     "sponsorOrganizationId" TEXT,
ADD COLUMN     "taxPolicy" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "quiz_section" ADD COLUMN     "adaptiveConfig" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "allowBackNavigation" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "cognitiveWeights" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "competenceWeights" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "durationSeconds" INTEGER,
ADD COLUMN     "excludedCount" INTEGER,
ADD COLUMN     "leastUsedWindowDays" INTEGER,
ADD COLUMN     "mandatoryCount" INTEGER,
ADD COLUMN     "poolMaxSize" INTEGER,
ADD COLUMN     "poolMinSize" INTEGER,
ADD COLUMN     "requireSequential" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "topicWeights" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "quiz_template" ADD COLUMN     "approvalWorkflowId" TEXT,
ADD COLUMN     "assessmentType" TEXT,
ADD COLUMN     "blueprintType" TEXT,
ADD COLUMN     "negativeMarkingPolicy" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "publishedBy" TEXT,
ADD COLUMN     "reviewComment" TEXT,
ADD COLUMN     "sectionShufflePolicy" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "totalMaxScore" DECIMAL(14,4),
ADD COLUMN     "totalQuestionCount" INTEGER,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "quiz_user_assignment" ADD COLUMN     "acceptedTermsAt" TIMESTAMP(3),
ADD COLUMN     "accessTokenHash" TEXT,
ADD COLUMN     "assignedBy" TEXT,
ADD COLUMN     "attemptsUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "eligibilitySnapshotId" TEXT,
ADD COLUMN     "groupId" TEXT,
ADD COLUMN     "inviteSentAt" TIMESTAMP(3),
ADD COLUMN     "lastAttemptId" TEXT,
ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "paymentOrderId" TEXT,
ADD COLUMN     "paymentStatus" TEXT,
ADD COLUMN     "regionId" TEXT,
ADD COLUMN     "revokeReason" TEXT,
ADD COLUMN     "revokedBy" TEXT;

-- AlterTable
ALTER TABLE "result_publication" ADD COLUMN     "certificateIncluded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "channel" TEXT NOT NULL DEFAULT 'WEB',
ADD COLUMN     "downloadAllowed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "exportJobId" TEXT,
ADD COLUMN     "watermarkPolicy" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "section_question" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "negativeScoreOverride" DECIMAL(10,4),
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "selectionRole" TEXT NOT NULL DEFAULT 'MANDATORY',
ADD COLUMN     "timeLimitOverride" INTEGER,
ADD COLUMN     "weight" DECIMAL(7,4);

-- AlterTable
ALTER TABLE "topic" ADD COLUMN     "assessmentContextId" TEXT,
ADD COLUMN     "depth" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "externalCode" TEXT,
ADD COLUMN     "orderIndex" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "path" TEXT,
ADD COLUMN     "tenantId" TEXT,
ADD COLUMN     "validFrom" TIMESTAMP(3),
ADD COLUMN     "validTo" TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "topic_question_classification" ALTER COLUMN "cognitiveLevelId" DROP NOT NULL,
ADD COLUMN     "classifierType" TEXT,
ADD COLUMN     "confidence" DECIMAL(7,4),
ADD COLUMN     "evidence" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "reviewComment" TEXT,
ADD COLUMN     "validityStatusReason" TEXT,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "topic_question_competence" ADD COLUMN     "contributionRule" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "minEvidenceRequired" INTEGER,
ADD COLUMN     "reportingWeight" DECIMAL(7,4),
ADD COLUMN     "reviewedBy" TEXT;

-- DropTable
-- Legacy question_type and feedback columns intentionally retained.

-- CreateTable
CREATE TABLE "CognitiveLevelClassification" (
    "id" TEXT NOT NULL,
    "classificationId" TEXT NOT NULL,
    "cognitiveLevelId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 0.1,

    CONSTRAINT "CognitiveLevelClassification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_workflow_event" (
    "id" TEXT NOT NULL,
    "aggregateType" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "previousStatus" TEXT,
    "newStatus" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "comment" TEXT,
    "actorUserId" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "assessment_workflow_event_pkey" PRIMARY KEY ("id")
);


-- Existing event identities are retained; Prisma supplies IDs for future rows.
UPDATE "outbox_event" SET "eventId" = "id" WHERE "eventId" IS NULL;
ALTER TABLE "outbox_event" ALTER COLUMN "eventId" SET NOT NULL;
-- CreateIndex
CREATE UNIQUE INDEX "CognitiveLevelClassification_classificationId_cognitiveLeve_key" ON "CognitiveLevelClassification"("classificationId", "cognitiveLevelId");

-- CreateIndex
CREATE INDEX "assessment_workflow_event_aggregateType_aggregateId_occurre_idx" ON "assessment_workflow_event"("aggregateType", "aggregateId", "occurredAt");

-- CreateIndex
CREATE INDEX "assessment_result_scheduleId_status_idx" ON "assessment_result"("scheduleId", "status");

-- CreateIndex
CREATE INDEX "assessment_result_regionId_districtId_schoolId_idx" ON "assessment_result"("regionId", "districtId", "schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "grading_job_attemptId_idempotencyKey_key" ON "grading_job"("attemptId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "manual_grading_resolution_manualTaskId_resolvedAt_idx" ON "manual_grading_resolution"("manualTaskId", "resolvedAt");

-- CreateIndex
CREATE UNIQUE INDEX "outbox_event_eventId_key" ON "outbox_event"("eventId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "outbox_event_status_availableAt_idx" ON "outbox_event"("status", "availableAt");

-- CreateIndex
CREATE INDEX "outbox_event_partitionKey_status_availableAt_idx" ON "outbox_event"("partitionKey", "status", "availableAt");

-- CreateIndex
CREATE UNIQUE INDEX "outbox_event_aggregateType_idempotencyKey_key" ON "outbox_event"("aggregateType", "idempotencyKey");

-- CreateIndex
CREATE INDEX "question_tenantId_lifecycleStatus_idx" ON "question"("tenantId", "lifecycleStatus");

-- CreateIndex
CREATE INDEX "question_parentId_idx" ON "question"("parentId");

-- CreateIndex
CREATE INDEX "question_version_type_idx" ON "question_version"("type");

-- CreateIndex
CREATE INDEX "reporting_attempt_fact_quizId_submittedAt_idx" ON "reporting_attempt_fact"("quizId", "submittedAt");

-- CreateIndex
CREATE INDEX "result_ai_analysis_assessmentResultId_idx" ON "result_ai_analysis"("assessmentResultId");

-- CreateIndex
CREATE INDEX "topic_assessmentContextId_path_idx" ON "topic"("assessmentContextId", "path");

-- CreateIndex
CREATE UNIQUE INDEX "topic_tenantId_assessmentContextId_code_key" ON "topic"("tenantId", "assessmentContextId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "topic_question_classification_topicId_questionId_assessment_key" ON "topic_question_classification"("topicId", "questionId", "assessmentContextId", "validatedQuestionVersionId");

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "question"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CognitiveLevelClassification" ADD CONSTRAINT "CognitiveLevelClassification_cognitiveLevelId_fkey" FOREIGN KEY ("cognitiveLevelId") REFERENCES "cognitive_level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CognitiveLevelClassification" ADD CONSTRAINT "CognitiveLevelClassification_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "topic_question_classification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cognitive_level" ADD CONSTRAINT "cognitive_level_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "cognitive_level"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manual_grading_resolution" ADD CONSTRAINT "manual_grading_resolution_manualTaskId_fkey" FOREIGN KEY ("manualTaskId") REFERENCES "manual_grading_task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_access_log" ADD CONSTRAINT "result_access_log_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "result_publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_ai_analysis" ADD CONSTRAINT "result_ai_analysis_assessmentResultId_fkey" FOREIGN KEY ("assessmentResultId") REFERENCES "assessment_result"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_workflow_event" ADD CONSTRAINT "question_workflow_event_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "ix_question_workflow_question_time" RENAME TO "question_workflow_event_questionId_occurredAt_idx";

-- RenameIndex
ALTER INDEX "ix_question_workflow_status_time" RENAME TO "question_workflow_event_newStatus_occurredAt_idx";

-- RenameIndex
ALTER INDEX "ix_assignment_user_status_schedule" RENAME TO "quiz_user_assignment_userId_status_scheduleId_idx";

-- RenameIndex
ALTER INDEX "ix_reporting_attempt_region_school" RENAME TO "reporting_attempt_fact_regionId_districtId_schoolId_idx";

-- RenameIndex
ALTER INDEX "ix_reporting_attempt_schedule_status" RENAME TO "reporting_attempt_fact_scheduleId_status_idx";

-- RenameIndex
ALTER INDEX "ix_result_access_publication_time" RENAME TO "result_access_log_publicationId_viewedAt_idx";


-- Preserve each legacy single cognitive classification as a new weighted relation.
INSERT INTO "CognitiveLevelClassification" ("id", "classificationId", "cognitiveLevelId", "weight")
SELECT 'legacy-' || "id", "id", "cognitiveLevelId", 1.0
FROM "topic_question_classification" WHERE "cognitiveLevelId" IS NOT NULL;

COMMIT;
