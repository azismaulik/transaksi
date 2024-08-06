import { db } from "@/lib/db";

export const getAllDataCustomer = async () => {
  try {
    const res = await db.customer.findMany({
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

export const getCustomerById = async (cust_id: number) => {
  try {
    const res = await db.customer.findUnique({
      where: {
        id: cust_id,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
    return [];
  }
};
