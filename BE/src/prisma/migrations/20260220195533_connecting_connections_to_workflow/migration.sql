/*
  Warnings:

  - A unique constraint covering the columns `[sourceNodeId,targetNodeId,sourceInput,targetInput]` on the table `Connection` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workflowId` to the `Connection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Connection" ADD COLUMN     "workflowId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Connection_sourceNodeId_targetNodeId_sourceInput_targetInpu_key" ON "Connection"("sourceNodeId", "targetNodeId", "sourceInput", "targetInput");

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
