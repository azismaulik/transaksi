/*
  Warnings:

  - You are about to alter the column `diskon` on the `Barang` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `stok` on the `Barang` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `diskon` on the `Sales` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Barang" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "harga" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "diskon" SET DATA TYPE INTEGER,
ALTER COLUMN "stok" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Sales" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "subtotal" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "diskon" SET DATA TYPE INTEGER,
ALTER COLUMN "ongkir" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "total_bayar" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "SalesDet" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "harga_bandrol" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "diskon_pct" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "diskon_nilai" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "harga_diskon" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "total" SET DATA TYPE DECIMAL(65,30);
