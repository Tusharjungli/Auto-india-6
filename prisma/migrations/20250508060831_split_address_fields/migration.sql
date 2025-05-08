/*
  Warnings:

  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "address",
ADD COLUMN     "addressLine" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "pincode" TEXT,
ADD COLUMN     "state" TEXT;
