ALTER TABLE "question" ADD COLUMN "revision" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "question_version" ADD COLUMN "classificationSnapshot" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "question_workflow_event" ADD COLUMN "requestId" TEXT;
CREATE UNIQUE INDEX "question_workflow_event_questionId_requestId_key" ON "question_workflow_event"("questionId", "requestId");
