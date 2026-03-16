/*
  Warnings:

  - You are about to drop the column `userId` on the `Package` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `Package` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Package" DROP CONSTRAINT "Package_userId_fkey";

-- AlterTable
ALTER TABLE "Package" DROP COLUMN "userId",
ADD COLUMN     "approvedById" INTEGER,
ADD COLUMN     "createdById" INTEGER NOT NULL,
ADD COLUMN     "reviewedById" INTEGER;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
