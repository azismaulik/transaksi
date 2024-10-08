import { db } from "@/lib/db";

export const getAllDataBarang = async () => {
  try {
    const res = await db.barang.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getReadyDataBarang = async () => {
  try {
    const res = await db.barang.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        stok: {
          gt: 0,
        },
      },
    });

    return res;
  } catch (error) {
    console.log(error);
    return [];
  }
};
