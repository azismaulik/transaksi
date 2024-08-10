import { getAllDataTransaction } from "@/api/transactions";
import Loading from "@/app/loading";
import { TransactionTable } from "@/components/tables/TransactionTable";
import { Suspense } from "react";
export default async function TransaksiPage() {
  const data = await getAllDataTransaction();
  console.log(data);
  return (
    <>
      <h1 className="text-2xl font-bold mb-10">Data Transaksi</h1>
      <Suspense fallback={<Loading />}>
        <TransactionTable data={data} />
      </Suspense>
    </>
  );
}
