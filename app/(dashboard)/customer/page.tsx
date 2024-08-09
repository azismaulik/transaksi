import { getAllDataCustomer } from "@/api/customer";
import { CustomerTable } from "@/components/tables/CustomerTable";
import { Suspense } from "react";

const PageCustomer = async () => {
  const data = await getAllDataCustomer();
  return (
    <>
      <h1 className="text-2xl font-bold mb-10">Data Customer</h1>

      <Suspense fallback={<span className="loader"></span>}>
        <CustomerTable data={data} />
      </Suspense>
    </>
  );
};

export default PageCustomer;
