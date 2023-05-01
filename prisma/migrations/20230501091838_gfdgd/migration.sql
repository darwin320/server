/*
  Warnings:

  - The values [type1,type2,type3] on the enum `Service_typeService` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `service` MODIFY `typeService` ENUM('Comida', 'Musica', 'Baile', 'Decoracion', 'Otro') NOT NULL;
