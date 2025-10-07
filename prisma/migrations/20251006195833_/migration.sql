-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "googleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZipLink" (
    "id" SERIAL NOT NULL,
    "linkId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "creatorId" INTEGER,
    "creatorEmail" TEXT,
    "publicKey" TEXT NOT NULL,
    "secretKey" TEXT NOT NULL,
    "tokenMint" TEXT,
    "amount" DECIMAL(20,9) NOT NULL,
    "memo" TEXT,
    "title" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "claimedAt" TIMESTAMP(3),

    CONSTRAINT "ZipLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZipClaim" (
    "id" SERIAL NOT NULL,
    "zipLinkId" INTEGER NOT NULL,
    "claimerAddr" TEXT,
    "claimerEmail" TEXT,
    "claimerName" TEXT,
    "txSignature" TEXT,
    "amount" DECIMAL(20,9) NOT NULL,
    "metadata" JSONB,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ZipClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZipLinkAnalytics" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "linksCreated" INTEGER NOT NULL DEFAULT 0,
    "linksClaimed" INTEGER NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(20,9) NOT NULL DEFAULT 0,
    "uniqueUsers" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZipLinkAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "ZipLink_linkId_key" ON "ZipLink"("linkId");

-- CreateIndex
CREATE UNIQUE INDEX "ZipLink_url_key" ON "ZipLink"("url");

-- CreateIndex
CREATE UNIQUE INDEX "ZipLink_publicKey_key" ON "ZipLink"("publicKey");

-- CreateIndex
CREATE INDEX "ZipLink_status_idx" ON "ZipLink"("status");

-- CreateIndex
CREATE INDEX "ZipLink_creatorId_idx" ON "ZipLink"("creatorId");

-- CreateIndex
CREATE INDEX "ZipLink_createdAt_idx" ON "ZipLink"("createdAt");

-- CreateIndex
CREATE INDEX "ZipClaim_zipLinkId_idx" ON "ZipClaim"("zipLinkId");

-- CreateIndex
CREATE INDEX "ZipClaim_claimerEmail_idx" ON "ZipClaim"("claimerEmail");

-- CreateIndex
CREATE INDEX "ZipClaim_createdAt_idx" ON "ZipClaim"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ZipLinkAnalytics_date_key" ON "ZipLinkAnalytics"("date");

-- AddForeignKey
ALTER TABLE "ZipLink" ADD CONSTRAINT "ZipLink_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZipClaim" ADD CONSTRAINT "ZipClaim_zipLinkId_fkey" FOREIGN KEY ("zipLinkId") REFERENCES "ZipLink"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
