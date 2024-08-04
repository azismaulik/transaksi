"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const productSchema = z.object({
  nama: z.string().min(1).max(100),
  harga: z.number().positive(),
  stok: z.number().positive(),
  kode: z.string(),
  diskon: z.number().min(0).max(100).optional(),
});

export async function addProduct(
  data: z.infer<typeof productSchema>
): Promise<{ success: boolean }> {
  const validatedData = productSchema.parse(data);

  const productData: Prisma.BarangCreateInput = {
    nama: validatedData.nama,
    harga: new Prisma.Decimal(validatedData.harga),
    stok: validatedData.stok,
    kode: validatedData.kode,
    diskon: validatedData.diskon || 0,
  };

  try {
    await db.barang.create({
      data: productData,
    });

    revalidatePath("/barang");
    return { success: true };
  } catch (error) {
    console.error("Failed to add product:", error);
    return { success: false };
  }
}

export async function updateProduct(
  id: number,
  data: z.infer<typeof productSchema>
): Promise<{ success: boolean }> {
  const validatedData = productSchema.parse(data);
  const productData: Prisma.BarangUpdateInput = {
    nama: validatedData.nama,
    harga: new Prisma.Decimal(validatedData.harga),
    stok: validatedData.stok,
    diskon: validatedData.diskon || 0,
  };

  try {
    await db.barang.update({
      where: {
        id,
      },
      data: productData,
    });
    revalidatePath("/barang");
    return { success: true };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { success: false };
  }
}

export async function deleteProduct(id: number): Promise<{ success: boolean }> {
  try {
    await db.barang.delete({
      where: {
        id,
      },
    });
    revalidatePath("/barang");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false };
  }
}
