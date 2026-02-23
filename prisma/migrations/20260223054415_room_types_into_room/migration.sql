/*
  Warnings:

  - You are about to drop the column `checkinDate` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `checkoutDate` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `staffId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `roomTypeId` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the `RoomType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `checkInRange` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `capacity` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_staffId_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_roomTypeId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "checkinDate",
DROP COLUMN "checkoutDate",
ADD COLUMN     "checkInRange" tstzrange NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "staffId";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "stockQty" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "roomTypeId",
ADD COLUMN     "capacity" INTEGER NOT NULL,
ADD COLUMN     "productId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "RoomType";

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Booking Constraint 
ALTER TABLE "Booking"
ADD CONSTRAINT "booking_no_overlap" EXCLUDE USING gist (
  "roomId" WITH =,
  "checkInRange" WITH &&
)
WHERE (status = 'CONFIRMED');