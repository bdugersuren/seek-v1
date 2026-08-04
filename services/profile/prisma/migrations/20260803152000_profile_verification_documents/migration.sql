-- Extend user profiles with candidate-facing profile fields.
ALTER TABLE "user_profile" ADD COLUMN IF NOT EXISTS "firstName" TEXT;
ALTER TABLE "user_profile" ADD COLUMN IF NOT EXISTS "lastName" TEXT;
ALTER TABLE "user_profile" ADD COLUMN IF NOT EXISTS "phoneNumber" TEXT;
ALTER TABLE "user_profile" ADD COLUMN IF NOT EXISTS "phoneNumberVerifiedAt" TIMESTAMP(3);
ALTER TABLE "user_profile" ADD COLUMN IF NOT EXISTS "organisation" TEXT;
ALTER TABLE "user_profile" ADD COLUMN IF NOT EXISTS "gender" TEXT;
ALTER TABLE "user_profile" ADD COLUMN IF NOT EXISTS "country" TEXT;
ALTER TABLE "user_profile" ADD COLUMN IF NOT EXISTS "address" TEXT;
ALTER TABLE "user_profile" ADD COLUMN IF NOT EXISTS "preferredLanguage" TEXT;
ALTER TABLE "user_profile" ADD COLUMN IF NOT EXISTS "completionStatus" TEXT;
ALTER TABLE "user_profile" ADD COLUMN IF NOT EXISTS "verifiedAt" TIMESTAMP(3);

-- Candidate/admin verification workflow.
CREATE TABLE IF NOT EXISTS "profile_verification" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rejectedReason" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_verification_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "profile_verification"
  DROP CONSTRAINT IF EXISTS "profile_verification_profileId_fkey";

ALTER TABLE "profile_verification"
  ADD CONSTRAINT "profile_verification_profileId_fkey"
  FOREIGN KEY ("profileId") REFERENCES "user_profile"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Candidate document metadata for files owned by file-service/MinIO.
CREATE TABLE IF NOT EXISTS "profile_document" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_document_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "profile_document"
  DROP CONSTRAINT IF EXISTS "profile_document_profileId_fkey";

ALTER TABLE "profile_document"
  ADD CONSTRAINT "profile_document_profileId_fkey"
  FOREIGN KEY ("profileId") REFERENCES "user_profile"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Audit trail for profile lifecycle, verification review, and documents.
CREATE TABLE IF NOT EXISTS "profile_audit_log" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actorUserId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "before" JSONB NOT NULL DEFAULT '{}',
    "after" JSONB NOT NULL DEFAULT '{}',
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_audit_log_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "profile_audit_log"
  DROP CONSTRAINT IF EXISTS "profile_audit_log_profileId_fkey";

ALTER TABLE "profile_audit_log"
  ADD CONSTRAINT "profile_audit_log_profileId_fkey"
  FOREIGN KEY ("profileId") REFERENCES "user_profile"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
