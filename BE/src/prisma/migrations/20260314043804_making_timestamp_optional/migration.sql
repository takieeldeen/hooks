-- AlterTable
ALTER TABLE "WorkflowExecution" ALTER COLUMN "startedAt" DROP NOT NULL,
ALTER COLUMN "completedAt" DROP NOT NULL;
