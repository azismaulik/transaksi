import { getAllDataBarang } from "@/api/barang";
import { getAllDataCustomer } from "@/api/customer";
import {
  getAllDataTransaction,
  getAllDetailTransactions,
} from "@/api/transactions";
import Card from "@/components/Card";
import { ChartComponent } from "@/components/Chart";
import { ArrowRightLeft, ContactRound, Package } from "lucide-react";
export default async function Home() {
  const transactions = await getAllDataTransaction();
  const products = await getAllDataBarang();
  const customers = await getAllDataCustomer();
  const transactionDetails = await getAllDetailTransactions();

  return (
    <section>
      <div className="grid md:grid-cols-3 gap-6 md:py-8">
        <Card
          title="Total Transaksi"
          length={transactions.length}
          icon={<ArrowRightLeft className="size-28" />}
          path="/transaksi"
        />
        <Card
          title="Total Barang"
          length={products.length}
          icon={<Package className="size-28" />}
          path="/barang"
        />
        <Card
          title="Total Customer"
          length={customers.length}
          icon={<ContactRound className="size-28" />}
          path="/customer"
        />
      </div>
      <div className="w-full mt-10">
        <ChartComponent transactions={transactionDetails} products={products} />
      </div>
    </section>
  );
}
