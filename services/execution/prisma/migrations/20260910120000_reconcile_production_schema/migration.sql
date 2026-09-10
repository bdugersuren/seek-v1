-- Reconcile previously unversioned schema changes without deleting historical values.
BEGIN;
-- CreateEnum
CREATE TYPE "ResponseApplyStatus" AS ENUM ('APPLIED', 'REJECTED', 'CONFLICT', 'DUPLICATE');

-- CreateEnum
CREATE TYPE "AnswerStatus" AS ENUM ('EMPTY', 'DRAFT', 'SAVED', 'REJECTED', 'CONFLICT');

-- DropForeignKey
ALTER TABLE "attempt_heartbeat_event" DROP CONSTRAINT "attempt_heartbeat_event_attemptId_fkey";

-- DropForeignKey
ALTER TABLE "attempt_instruction_acknowledgement" DROP CONSTRAINT "attempt_instruction_acknowledgement_attemptId_fkey";

-- DropForeignKey
ALTER TABLE "attempt_lifecycle_event" DROP CONSTRAINT "attempt_lifecycle_event_attemptId_fkey";

-- DropForeignKey
ALTER TABLE "attempt_lock_decision" DROP CONSTRAINT "attempt_lock_decision_attemptId_fkey";

-- DropForeignKey
ALTER TABLE "attempt_navigation_event" DROP CONSTRAINT "attempt_navigation_event_attemptId_fkey";

-- DropForeignKey
ALTER TABLE "attempt_payload_receipt" DROP CONSTRAINT "attempt_payload_receipt_attemptId_fkey";

-- DropForeignKey
ALTER TABLE "runtime_delivery_event" DROP CONSTRAINT "runtime_delivery_event_attemptId_fkey";

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
ADD COLUMN     "traceId" TEXT;

-- AlterTable
ALTER TABLE "question_response" ALTER COLUMN "answerStatus" DROP DEFAULT,
ALTER COLUMN "answerStatus" TYPE "AnswerStatus" USING "answerStatus"::"AnswerStatus",
ALTER COLUMN "answerStatus" SET DEFAULT 'SAVED';

-- AlterTable
ALTER TABLE "question_response_event" ALTER COLUMN "applyStatus" DROP DEFAULT,
ALTER COLUMN "applyStatus" TYPE "ResponseApplyStatus" USING "applyStatus"::"ResponseApplyStatus",
ALTER COLUMN "applyStatus" SET DEFAULT 'APPLIED';


-- Existing event identities are retained; Prisma supplies IDs for future rows.
UPDATE "outbox_event" SET "eventId" = "id" WHERE "eventId" IS NULL;
ALTER TABLE "outbox_event" ALTER COLUMN "eventId" SET NOT NULL;
-- CreateIndex
CREATE INDEX "attempt_eligibility_snapshot_tenantId_organizationId_status_idx" ON "attempt_eligibility_snapshot"("tenantId", "organizationId", "status");

-- CreateIndex
CREATE INDEX "attempt_eligibility_snapshot_regionId_districtId_schoolId_idx" ON "attempt_eligibility_snapshot"("regionId", "districtId", "schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "attempt_lifecycle_event_attemptId_idempotencyKey_key" ON "attempt_lifecycle_event"("attemptId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "attempt_payload_receipt_attemptId_deliveredAt_idx" ON "attempt_payload_receipt"("attemptId", "deliveredAt");

-- CreateIndex
CREATE UNIQUE INDEX "attempt_submission_receiptNumber_key" ON "attempt_submission"("receiptNumber");

-- CreateIndex
CREATE UNIQUE INDEX "outbox_event_eventId_key" ON "outbox_event"("eventId");

-- CreateIndex
CREATE INDEX "outbox_event_partitionKey_status_availableAt_idx" ON "outbox_event"("partitionKey", "status", "availableAt");

-- CreateIndex
CREATE UNIQUE INDEX "outbox_event_aggregateType_idempotencyKey_key" ON "outbox_event"("aggregateType", "idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_attempt_candidateId_idempotencyKey_key" ON "quiz_attempt"("candidateId", "idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_violation_attemptId_idempotencyKey_key" ON "quiz_violation"("attemptId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "runtime_delivery_event_attemptId_deliveredAt_idx" ON "runtime_delivery_event"("attemptId", "deliveredAt");

-- AddForeignKey
ALTER TABLE "attempt_lifecycle_event" ADD CONSTRAINT "attempt_lifecycle_event_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "quiz_attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_heartbeat_event" ADD CONSTRAINT "attempt_heartbeat_event_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "quiz_attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_instruction_acknowledgement" ADD CONSTRAINT "attempt_instruction_acknowledgement_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "quiz_attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_navigation_event" ADD CONSTRAINT "attempt_navigation_event_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "quiz_attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_lock_decision" ADD CONSTRAINT "attempt_lock_decision_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "quiz_attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_payload_receipt" ADD CONSTRAINT "attempt_payload_receipt_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "quiz_attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "runtime_delivery_event" ADD CONSTRAINT "runtime_delivery_event_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "quiz_attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "ix_heartbeat_attempt_time" RENAME TO "attempt_heartbeat_event_attemptId_serverReceivedAt_idx";

-- RenameIndex
ALTER INDEX "ix_heartbeat_status_time" RENAME TO "attempt_heartbeat_event_status_serverReceivedAt_idx";

-- RenameIndex
ALTER INDEX "uq_instruction_ack_attempt_hash" RENAME TO "attempt_instruction_acknowledgement_attemptId_instructionHa_key";

-- RenameIndex
ALTER INDEX "ix_attempt_lifecycle_attempt_time" RENAME TO "attempt_lifecycle_event_attemptId_occurredAt_idx";

-- RenameIndex
ALTER INDEX "ix_lock_decision_attempt_time" RENAME TO "attempt_lock_decision_attemptId_decidedAt_idx";

-- RenameIndex
ALTER INDEX "ix_navigation_attempt_time" RENAME TO "attempt_navigation_event_attemptId_serverReceivedAt_idx";

-- RenameIndex
ALTER INDEX "uq_navigation_idempotency" RENAME TO "attempt_navigation_event_attemptId_idempotencyKey_key";

-- RenameIndex
ALTER INDEX "uq_payload_receipt" RENAME TO "attempt_payload_receipt_attemptId_payloadHash_receiptType_key";

-- RenameIndex
ALTER INDEX "ix_submission_status_requested" RENAME TO "attempt_submission_resultStatus_requestedAt_idx";

-- RenameIndex
ALTER INDEX "ix_response_event_attempt_sequence" RENAME TO "question_response_event_attemptId_clientInstanceId_clientSe_idx";

-- RenameIndex
ALTER INDEX "ix_response_event_partition_received" RENAME TO "question_response_event_partitionKey_serverReceivedAt_idx";

-- RenameIndex
ALTER INDEX "ix_attempt_partition_status_expiry" RENAME TO "quiz_attempt_partitionKey_status_expiresAt_idx";

-- RenameIndex
ALTER INDEX "ix_attempt_schedule_candidate_status" RENAME TO "quiz_attempt_scheduleId_candidateId_status_idx";

-- RenameIndex
ALTER INDEX "ix_violation_attempt_type_time" RENAME TO "quiz_violation_attemptId_violationType_serverReceivedAt_idx";

-- RenameIndex
ALTER INDEX "uq_runtime_delivery" RENAME TO "runtime_delivery_event_attemptId_eventType_deliveryKey_key";


COMMIT;
