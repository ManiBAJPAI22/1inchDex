-- CreateTable
CREATE TABLE "tradingPairs" (
    "id" TEXT NOT NULL,
    "pairId" TEXT NOT NULL,
    "baseToken" TEXT NOT NULL,
    "quoteToken" TEXT NOT NULL,
    "baseTokenAddress" TEXT NOT NULL,
    "quoteTokenAddress" TEXT NOT NULL,
    "baseDecimals" INTEGER NOT NULL,
    "quoteDecimals" INTEGER NOT NULL,
    "lastPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "priceChange24h" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "volume24h" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "high24h" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "low24h" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "tradingPairs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orderBook" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "metadata" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "pairId" TEXT NOT NULL DEFAULT 'BTC-USDT',
    "userAddress" TEXT NOT NULL DEFAULT 'unknown',
    "status" TEXT NOT NULL DEFAULT 'open',
    "filledSize" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orderBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orderBookAudit" (
    "id" SERIAL NOT NULL,
    "snapshot" JSONB NOT NULL,
    "journal" JSONB[],
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orderBookAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trades" (
    "id" TEXT NOT NULL,
    "pairId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "side" TEXT NOT NULL,
    "makerAddress" TEXT NOT NULL,
    "takerAddress" TEXT NOT NULL,
    "makerOrderId" TEXT NOT NULL,
    "takerOrderId" TEXT NOT NULL,
    "txHash" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "userAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tradingPairs_pairId_key" ON "tradingPairs"("pairId");

-- CreateIndex
CREATE UNIQUE INDEX "orderBook_orderId_key" ON "orderBook"("orderId");

-- CreateIndex
CREATE INDEX "trades_pairId_idx" ON "trades"("pairId");

-- CreateIndex
CREATE INDEX "trades_createdAt_idx" ON "trades"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "users_userAddress_key" ON "users"("userAddress");
