import React from "react";
import CreateTransactionForm from "./Form";
import { getAllDataCustomer } from "@/api/customer";
import { getAllDataBarang } from "@/api/barang";

const BuatTransaksiPage = async () => {
  const customers = await getAllDataCustomer();
  const products = await getAllDataBarang();

  return <CreateTransactionForm customers={customers} products={products} />;
};

export default BuatTransaksiPage;
