import { getAllDataTransaction } from "@/api/transactions";
import { TransactionTable } from "@/components/tables/TransactionTable";
export default async function TransaksiPage() {
  const data = await getAllDataTransaction();
  return (
    <>
      <h1 className="text-2xl font-bold mb-10">Data Transaksi</h1>
      <TransactionTable data={data} />
    </>
  );
}
