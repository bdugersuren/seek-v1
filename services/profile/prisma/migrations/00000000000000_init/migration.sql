-- CreateTable
CREATE TABLE "user_profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT,
    "birthDate" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_location" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "regionId" TEXT,
    "districtId" TEXT,
    "address" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education_record" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "organizationId" TEXT,
    "schoolId" TEXT,
    "classId" TEXT,
    "level" TEXT,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "education_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_record" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "organizationId" TEXT,
    "positionTitle" TEXT,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "work_record_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profile_userId_key" ON "user_profile"("userId");

-- CreateIndex
CREATE INDEX "profile_location_regionId_districtId_idx" ON "profile_location"("regionId", "districtId");

-- CreateIndex
CREATE INDEX "education_record_schoolId_classId_idx" ON "education_record"("schoolId", "classId");

-- CreateIndex
CREATE INDEX "work_record_organizationId_idx" ON "work_record"("organizationId");

-- AddForeignKey
ALTER TABLE "profile_location" ADD CONSTRAINT "profile_location_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "user_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education_record" ADD CONSTRAINT "education_record_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "user_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_record" ADD CONSTRAINT "work_record_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "user_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

