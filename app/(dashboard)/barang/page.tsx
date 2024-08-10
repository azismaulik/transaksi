import { getAllDataBarang } from "@/api/barang";
import Loading from "@/app/loading";
import { BarangTable } from "@/components/tables/ItemTable";
import { Suspense } from "react";

const PageBarang = async () => {
  const items = await getAllDataBarang();

  return (
    <>
      <h1 className="text-2xl font-bold mb-10">Data Barang</h1>

      <Suspense fallback={<Loading />}>
        <BarangTable data={items} />
      </Suspense>
    </>
  );
};

export default PageBarang;
