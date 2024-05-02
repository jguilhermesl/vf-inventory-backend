-- DropIndex
DROP INDEX "products_code_key";

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "code" DROP NOT NULL;
