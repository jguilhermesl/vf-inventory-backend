/*
  Warnings:

  - Added the required column `quantity` to the `history` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "history" DROP CONSTRAINT "history_userId_fkey";

-- AlterTable
ALTER TABLE "history" ADD COLUMN     "customerName" TEXT,
ADD COLUMN     "customerPaymentType" TEXT,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
