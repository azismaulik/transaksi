// "use server";

// import { z } from "zod";
// import { db } from "@/lib/db";
// import { Prisma } from "@prisma/client";
// import { revalidatePath } from "next/cache";

// const transactionSchema = z.object({
//   kode: z.string().min(1).max(15),
//   tanggal: z.string().min(1),
//   customer_id: z.string().min(1),
//   subtotal: z.number().min(0),
//   diskon: z.number().min(0),
//   ongkir: z.number().min(0),
//   total_bayar: z.number().min(0),
// });

// export async function addTransaction(
//   data: z.infer<typeof transactionSchema>
// ): Promise<{ success: boolean }> {
//   const validatedData = transactionSchema.parse(data);

//   const transactionData = {
//     kode: validatedData.kode,
//     tgl: new Date(validatedData.tanggal),
//     cust: { connect: { id: parseInt(validatedData.customer_id) } },
//     subtotal: new Prisma.Decimal(validatedData.subtotal),
//     diskon: new Prisma.Decimal(validatedData.diskon),
//     ongkir: new Prisma.Decimal(validatedData.ongkir),
//     total_bayar: new Prisma.Decimal(validatedData.total_bayar),
//   };

//   try {
//     await db.sales.create({
//       data: transactionData,
//     });

//     revalidatePath("/transactions");
//     return { success: true };
//   } catch (error) {
//     console.error("Failed to add transaction:", error);
//     return { success: false };
//   }
// }
