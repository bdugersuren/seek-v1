-- CreateTable
CREATE TABLE "reporting_attempt_fact" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "resultId" TEXT,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reporting_attempt_fact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reporting_attempt_fact_attemptId_key" ON "reporting_attempt_fact"("attemptId");

-- CreateIndex
CREATE INDEX "reporting_attempt_fact_scheduleId_status_idx" ON "reporting_attempt_fact"("scheduleId", "status");

-- CreateIndex
CREATE INDEX "reporting_attempt_fact_regionId_districtId_schoolId_idx" ON "reporting_attempt_fact"("regionId", "districtId", "schoolId");

-- CreateIndex
CREATE INDEX "reporting_attempt_fact_quizId_submittedAt_idx" ON "reporting_attempt_fact"("quizId", "submittedAt");

