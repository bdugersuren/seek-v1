-- CreateTable
CREATE TABLE "organisation" (
    "id" TEXT NOT NULL,
    "parentId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "regionId" TEXT,
    "districtId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organisation_unit" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "parentId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organisation_unit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organisation_code_key" ON "organisation"("code");

-- CreateIndex
CREATE INDEX "organisation_parentId_idx" ON "organisation"("parentId");

-- CreateIndex
CREATE INDEX "organisation_regionId_districtId_idx" ON "organisation"("regionId", "districtId");

-- CreateIndex
CREATE INDEX "organisation_unit_parentId_idx" ON "organisation_unit"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "organisation_unit_organisationId_code_key" ON "organisation_unit"("organisationId", "code");

-- AddForeignKey
ALTER TABLE "organisation" ADD CONSTRAINT "organisation_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organisation_unit" ADD CONSTRAINT "organisation_unit_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organisation_unit" ADD CONSTRAINT "organisation_unit_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "organisation_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

