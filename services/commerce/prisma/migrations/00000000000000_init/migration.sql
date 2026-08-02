-- CreateTable
CREATE TABLE "payment_order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scheduleId" TEXT,
    "assignmentId" TEXT,
    "amount" DECIMAL(14,2) NOT NULL,
    "currencyCode" VARCHAR(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "provider" TEXT,
    "providerRef" TEXT,
    "idempotencyKey" TEXT,
    "paidAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_transaction" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerRef" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "payment_order_scheduleId_status_idx" ON "payment_order"("scheduleId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "payment_order_userId_idempotencyKey_key" ON "payment_order"("userId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "payment_transaction_provider_providerRef_idx" ON "payment_transaction"("provider", "providerRef");

-- AddForeignKey
ALTER TABLE "payment_transaction" ADD CONSTRAINT "payment_transaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "payment_order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

