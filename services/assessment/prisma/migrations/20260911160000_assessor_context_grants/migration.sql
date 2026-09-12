CREATE TABLE "assessor_context_grant" (
 "id" TEXT NOT NULL, "contextId" TEXT NOT NULL, "userId" TEXT NOT NULL,
 "assignedBy" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "assessor_context_grant_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "assessor_context_grant_contextId_fkey" FOREIGN KEY ("contextId") REFERENCES "assessment_context"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "assessor_context_grant_contextId_userId_key" ON "assessor_context_grant"("contextId", "userId");
CREATE INDEX "assessor_context_grant_userId_idx" ON "assessor_context_grant"("userId");
