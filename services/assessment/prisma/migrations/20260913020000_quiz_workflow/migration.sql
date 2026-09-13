CREATE TABLE "quiz_mutation_request" (
  "key" TEXT NOT NULL PRIMARY KEY,
  "fingerprint" TEXT NOT NULL,
  "quizId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "quiz_mutation_request_quizId_idx" ON "quiz_mutation_request"("quizId");
