import { getAllDataCustomer } from "@/api/customer";
import { CustomerTable } from "@/components/tables/CustomerTable";

const PageCustomer = async () => {
  const data = await getAllDataCustomer();
  return (
    <>
      <h1 className="text-2xl font-bold mb-10">Data Customer</h1>

      <CustomerTable data={data} />
    </>
  );
};

export default PageCustomer;
