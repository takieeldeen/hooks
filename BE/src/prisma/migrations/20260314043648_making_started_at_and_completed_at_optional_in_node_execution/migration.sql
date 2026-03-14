-- AlterTable
ALTER TABLE "NodeExecution" ALTER COLUMN "startedAt" DROP NOT NULL,
ALTER COLUMN "completedAt" DROP NOT NULL;
