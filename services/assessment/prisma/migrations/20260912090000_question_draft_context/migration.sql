ALTER TABLE "question" ADD COLUMN "assessmentContextId" TEXT;
CREATE INDEX "question_assessmentContextId_ownerUserId_idx" ON "question"("assessmentContextId", "ownerUserId");
ALTER TABLE "question" ADD CONSTRAINT "question_assessmentContextId_fkey" FOREIGN KEY ("assessmentContextId") REFERENCES "assessment_context"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
