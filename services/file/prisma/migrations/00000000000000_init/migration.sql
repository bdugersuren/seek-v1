-- CreateTable
CREATE TABLE "stored_file" (
    "id" TEXT NOT NULL,
    "ownerUserId" TEXT,
    "bucket" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "checksum" TEXT,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stored_file_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stored_file_storageKey_key" ON "stored_file"("storageKey");

-- CreateIndex
CREATE INDEX "stored_file_ownerUserId_idx" ON "stored_file"("ownerUserId");

-- CreateIndex
CREATE INDEX "stored_file_bucket_status_idx" ON "stored_file"("bucket", "status");

