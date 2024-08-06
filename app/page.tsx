import { getAllDataTransaction } from "@/api/transactions";
import { TransactionTable } from "@/components/tables/TransactionTable";
export default async function Home() {
  const data = await getAllDataTransaction();
  return <></>;
}
