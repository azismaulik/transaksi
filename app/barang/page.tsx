import { getAllDataBarang } from "@/api/barang";
import { BarangTable } from "@/components/tables/ItemTable";

const PageBarang = async () => {
  const items = await getAllDataBarang();

  return (
    <>
      <h1 className="text-2xl font-bold mb-10">Data Barang</h1>

      <BarangTable data={items} />
    </>
  );
};

export default PageBarang;
