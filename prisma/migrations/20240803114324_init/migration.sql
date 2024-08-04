-- CreateTable
CREATE TABLE "Barang" (
    "id" SERIAL NOT NULL,
    "kode" VARCHAR(10) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "harga" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Barang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "kode" VARCHAR(10) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "telp" VARCHAR(20) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sales" (
    "id" SERIAL NOT NULL,
    "kode" VARCHAR(15) NOT NULL,
    "tgl" TIMESTAMP(3) NOT NULL,
    "cust_id" INTEGER NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "diskon" DECIMAL(10,2) NOT NULL,
    "ongkir" DECIMAL(10,2) NOT NULL,
    "total_bayar" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesDet" (
    "id" SERIAL NOT NULL,
    "sales_id" INTEGER NOT NULL,
    "barang_id" INTEGER NOT NULL,
    "harga_bandrol" DECIMAL(10,2) NOT NULL,
    "qty" INTEGER NOT NULL,
    "diskon_pct" DECIMAL(5,2) NOT NULL,
    "diskon_nilai" DECIMAL(10,2) NOT NULL,
    "harga_diskon" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "SalesDet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Barang_kode_key" ON "Barang"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_kode_key" ON "Customer"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "Sales_kode_key" ON "Sales"("kode");

-- AddForeignKey
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_cust_id_fkey" FOREIGN KEY ("cust_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesDet" ADD CONSTRAINT "SalesDet_sales_id_fkey" FOREIGN KEY ("sales_id") REFERENCES "Sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesDet" ADD CONSTRAINT "SalesDet_barang_id_fkey" FOREIGN KEY ("barang_id") REFERENCES "Barang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
