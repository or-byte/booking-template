/*
  Warnings:

  - You are about to drop the column `name` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Package` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `PackageItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `PackageItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Package_slug_key";

-- AlterTable
ALTER TABLE "Package" DROP COLUMN "name",
DROP COLUMN "slug",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PackageItem" ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
