ALTER TABLE "reporting_attempt_fact"
  ADD COLUMN IF NOT EXISTS "tenantId" TEXT;

CREATE INDEX IF NOT EXISTS "ix_reporting_attempt_tenant_schedule"
  ON "reporting_attempt_fact"("tenantId", "scheduleId", "status");
