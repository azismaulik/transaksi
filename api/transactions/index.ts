import { db } from "@/lib/db";

export const getAllDataTransaction = async () => {
  try {
    const res = await db.sales.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        customer: true,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getTransactionById = async (id: number) => {
  try {
    const res = await db.sales.findFirst({
      where: {
        id,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllDetailTransactions = async () => {
  try {
    const res = await db.salesDet.findMany();
    return res;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getTransactionDetail = async (id: number) => {
  try {
    const res = await db.salesDet.findMany({
      where: {
        sales_id: id,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
    return [];
  }
};
