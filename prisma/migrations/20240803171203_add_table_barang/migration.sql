/*
  Warnings:

  - Added the required column `diskon` to the `Barang` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stok` to the `Barang` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Barang" ADD COLUMN     "diskon" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "stok" DECIMAL(65,30) NOT NULL;
