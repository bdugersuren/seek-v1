-- AlterTable
ALTER TABLE "UserAccount" ADD COLUMN "isEmailVerified" BOOLEAN NOT NULL DEFAULT false;

-- Backfill existing active developer and production accounts as verified.
UPDATE "UserAccount"
SET "isEmailVerified" = true
WHERE "status" = 'ACTIVE';

-- CreateTable
CREATE TABLE "EmailVerificationToken" (
    "id" TEXT NOT NULL,
    "userAccountId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationToken_tokenHash_key" ON "EmailVerificationToken"("tokenHash");

-- CreateIndex
CREATE INDEX "EmailVerificationToken_userAccountId_expiresAt_idx" ON "EmailVerificationToken"("userAccountId", "expiresAt");

-- AddForeignKey
ALTER TABLE "EmailVerificationToken" ADD CONSTRAINT "EmailVerificationToken_userAccountId_fkey" FOREIGN KEY ("userAccountId") REFERENCES "UserAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
