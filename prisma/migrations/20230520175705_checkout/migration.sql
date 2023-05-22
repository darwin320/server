/*
  Warnings:

  - You are about to drop the column `checkout` on the `service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `reservacion` ADD COLUMN `checkout` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `service` DROP COLUMN `checkout`;
