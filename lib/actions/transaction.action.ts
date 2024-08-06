"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const transactionSchema = z.object({
  kode: z.string().min(1).max(15),
  tanggal: z.string().min(1),
  customer_id: z.string().min(1),
  subtotal: z.number().min(0),
  diskon_persen: z.number().min(0).max(100),
  diskon_amount: z.number().min(0),
  ongkir: z.number().min(0),
  total_bayar: z.number().min(0),
});

const productSchema = z.object({
  id: z.number(),
  kode: z.string(),
  nama: z.string(),
  harga: z.union([z.number(), z.string(), z.instanceof(Prisma.Decimal)]),
  stok: z.number(),
  diskon: z.number(),
  qty: z.number(),
});

export async function addTransaction(
  data: z.infer<typeof transactionSchema>,
  barangs: z.infer<typeof productSchema>[]
): Promise<{ success: boolean; message?: string }> {
  try {
    const validatedData = transactionSchema.parse(data);
    const validatedBarangs = z.array(productSchema).parse(barangs);

    const transactionData = {
      kode: validatedData.kode,
      tgl: new Date(validatedData.tanggal),
      cust_id: parseInt(validatedData.customer_id),
      subtotal: new Prisma.Decimal(validatedData.subtotal),
      diskon: validatedData.diskon_persen,
      ongkir: new Prisma.Decimal(validatedData.ongkir),
      total_bayar: new Prisma.Decimal(validatedData.total_bayar),
    };

    const result = await db.$transaction(async (prisma) => {
      const sale = await prisma.sales.create({
        data: transactionData,
      });

      for (const barang of validatedBarangs) {
        await prisma.salesDet.create({
          data: {
            sales_id: sale.id,
            barang_id: barang.id,
            harga_bandrol: new Prisma.Decimal(barang.harga),
            qty: barang.qty,
            diskon_pct: barang.diskon,
            diskon_nilai: new Prisma.Decimal(
              Number(barang.harga) * (barang.diskon / 100)
            ),
            harga_diskon: new Prisma.Decimal(
              (Number(barang.harga) * (100 - barang.diskon)) / 100
            ),
            total: new Prisma.Decimal(
              ((Number(barang.harga) * (100 - barang.diskon)) / 100) *
                barang.qty
            ),
          },
        });

        await prisma.barang.update({
          where: { id: barang.id },
          data: { stok: { decrement: barang.qty } },
        });
      }

      return sale;
    });

    console.log("Transaction created:", result);
    revalidatePath("/transactions");
    return { success: true, message: "Transaksi berhasil dibuat" };
  } catch (error) {
    console.error("Failed to add transaction:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
