ALTER TABLE "quiz_template" ADD COLUMN "topicId" TEXT;
ALTER TABLE "quiz_section" ADD COLUMN "selectionRules" JSONB NOT NULL DEFAULT '{}';
