import { TransactionTable } from "@/components/tables/TransactionTable";
export default function Home() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-10">Data Transaksi</h1>
      <TransactionTable />
    </>
  );
}
