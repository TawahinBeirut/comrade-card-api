/*
  Warnings:

  - You are about to drop the column `ProductsList` on the `Categorie` table. All the data in the column will be lost.
  - You are about to drop the column `Stock` on the `Categorie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Categorie" DROP COLUMN "ProductsList",
DROP COLUMN "Stock";
