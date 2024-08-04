"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const customerSchema = z.object({
  name: z.string().min(1).max(100),
  telp: z.string().min(1).max(20),
  kode: z.string().min(1).max(10),
});

export async function addCustomer(
  data: z.infer<typeof customerSchema>
): Promise<{ success: boolean }> {
  const validatedData = customerSchema.parse(data);

  const customerData: Prisma.CustomerCreateInput = {
    name: validatedData.name,
    telp: validatedData.telp,
    kode: validatedData.kode,
  };

  try {
    await db.customer.create({
      data: customerData,
    });

    revalidatePath("/customer");
    return { success: true };
  } catch (error) {
    console.error("Failed to add customer:", error);
    return { success: false };
  }
}

export async function updateCustomer(
  id: number,
  data: z.infer<typeof customerSchema>
): Promise<{ success: boolean }> {
  const validatedData = customerSchema.parse(data);

  const customerData: Prisma.CustomerUpdateInput = {
    name: validatedData.name,
    telp: validatedData.telp,
    kode: validatedData.kode,
  };

  try {
    await db.customer.update({
      where: { id },
      data: customerData,
    });

    revalidatePath("/customer");
    return { success: true };
  } catch (error) {
    console.error("Failed to update customer:", error);
    return { success: false };
  }
}

export async function deleteCustomer(
  id: number
): Promise<{ success: boolean }> {
  try {
    await db.customer.delete({ where: { id } });
    revalidatePath("/customer");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete customer:", error);
    return { success: false };
  }
}
