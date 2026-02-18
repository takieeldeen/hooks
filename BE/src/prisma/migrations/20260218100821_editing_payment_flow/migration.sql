/*
  Warnings:

  - The `gateway_transaction_id` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `orderId` on the `Subscription` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Subscription_orderId_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "gateway_transaction_id",
ADD COLUMN     "gateway_transaction_id" INTEGER,
ALTER COLUMN "billing_period_start" DROP NOT NULL,
ALTER COLUMN "billing_period_end" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "orderId",
ALTER COLUMN "current_period_start" DROP NOT NULL,
ALTER COLUMN "current_period_end" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_gateway_transaction_id_key" ON "Payment"("gateway_transaction_id");
