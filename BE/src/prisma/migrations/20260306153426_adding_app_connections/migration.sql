-- CreateEnum
CREATE TYPE "AppConnectionType" AS ENUM ('GOOGLE', 'SLACK', 'DISCORD');

-- CreateTable
CREATE TABLE "app_connection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "AppConnectionType" NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "externalId" TEXT,
    "externalName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_connection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "app_connection_userId_idx" ON "app_connection"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "app_connection_userId_type_key" ON "app_connection"("userId", "type");

-- AddForeignKey
ALTER TABLE "app_connection" ADD CONSTRAINT "app_connection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
