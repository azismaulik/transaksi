import React from "react";
import CreateTransactionForm from "./Form";
import { getAllDataCustomer } from "@/api/customer";
import { getReadyDataBarang } from "@/api/barang";

const BuatTransaksiPage = async () => {
  const customers = await getAllDataCustomer();
  const products = await getReadyDataBarang();

  return <CreateTransactionForm customers={customers} products={products} />;
};

export default BuatTransaksiPage;
