/*
  Warnings:

  - You are about to drop the column `productId` on the `history` table. All the data in the column will be lost.
  - Made the column `userId` on table `history` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "history" DROP CONSTRAINT "history_productId_fkey";

-- DropForeignKey
ALTER TABLE "history" DROP CONSTRAINT "history_userId_fkey";

-- AlterTable
ALTER TABLE "history" DROP COLUMN "productId",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "inventory" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
