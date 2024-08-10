import { getAllDataCustomer } from "@/api/customer";
import Loading from "@/app/loading";
import { CustomerTable } from "@/components/tables/CustomerTable";
import { Suspense } from "react";

const PageCustomer = async () => {
  const data = await getAllDataCustomer();
  return (
    <>
      <h1 className="text-2xl font-bold mb-10">Data Customer</h1>

      <Suspense fallback={<Loading />}>
        <CustomerTable data={data} />
      </Suspense>
    </>
  );
};

export default PageCustomer;
