/*
  Warnings:

  - You are about to drop the column `validty` on the `inventory` table. All the data in the column will be lost.
  - Added the required column `validity` to the `inventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "inventory" DROP COLUMN "validty",
ADD COLUMN     "validity" TIMESTAMP(3) NOT NULL;
