import { getAllDataBarang } from "@/api/barang";
import { getCustomerById } from "@/api/customer";
import { getTransactionById, getTransactionDetail } from "@/api/transactions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/helper/formatDate";
import { formatRupiah } from "@/lib/helper/formatRupiah";
import { Sales } from "@prisma/client";

const getDetail = async (id: number): Promise<Sales | null> => {
  const data = await getTransactionById(id);

  if (Array.isArray(data)) {
    return null;
  }

  return data;
};

const getCustomer = async (id: number) => {
  const data = await getCustomerById(id);

  if (Array.isArray(data)) {
    return null;
  }

  return data;
};

const DetailTransaksiPage = async ({ params }: { params: { id: string } }) => {
  if (!params?.id) return null;

  const transaksi = await getDetail(parseInt(params.id));

  if (!transaksi) {
    return <div>Transaction not found</div>;
  }

  const customer = await getCustomer(transaksi.cust_id);

  if (!customer) {
    return <div>Customer not found</div>;
  }
  const details = await getTransactionDetail(transaksi.id);

  const barangs = await getAllDataBarang();

  return (
    <div>
      <h1 className="text-3xl font-bold">Detail Transaksi</h1>
      <div className="font-semibold mt-10 space-y-4">
        <p>Kode Customer: {customer.kode}</p>
        <p>Nama Customer: {customer.name}</p>
        <p>No Telpon: {customer.telp}</p>
        <p>Tanggal Transaksi: {formatDate(transaksi.tgl)}</p>
        <p>Kode Transaksi: {transaksi.kode}</p>
      </div>

      {details.length > 0 && (
        <div className="mt-10 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode Barang</TableHead>
                <TableHead>Nama Barang</TableHead>
                <TableHead>Harga Banderol</TableHead>
                <TableHead>Diskon Perbarang (%)</TableHead>
                <TableHead>Diskon Perbarang (Rp)</TableHead>
                <TableHead>Harga Diskon</TableHead>
                <TableHead>QTY</TableHead>
                <TableHead>Harga Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {details.map((detail) => (
                <TableRow key={detail.id}>
                  <TableCell>
                    {barangs.find((b) => b.id === detail.barang_id)?.kode}
                  </TableCell>
                  <TableCell className="truncate">
                    {barangs.find((b) => b.id === detail.barang_id)?.nama}
                  </TableCell>
                  <TableCell>
                    {formatRupiah(Number(detail.harga_bandrol))}
                  </TableCell>
                  <TableCell>
                    {Number(
                      barangs.find((b) => b.id === detail.barang_id)?.diskon
                    )}
                    %
                  </TableCell>
                  <TableCell>
                    {formatRupiah(
                      (Number(
                        barangs.find((b) => b.id === detail.barang_id)?.diskon
                      ) *
                        Number(detail.harga_bandrol)) /
                        100
                    )}
                  </TableCell>
                  <TableCell>
                    {formatRupiah(Number(detail.harga_diskon))}
                  </TableCell>
                  <TableCell>{detail.qty}</TableCell>
                  <TableCell>{formatRupiah(Number(detail.total))}</TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell colSpan={7} className="text-right tracking-widest">
                  Subtotal:
                </TableCell>
                <TableCell>
                  {formatRupiah(Number(transaksi.subtotal))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={7} className="text-right tracking-widest">
                  Diskon:
                </TableCell>
                <TableCell>
                  {Number(transaksi.diskon)}% (
                  {formatRupiah(
                    (Number(transaksi.diskon) * Number(transaksi.subtotal)) /
                      100
                  )}
                  )
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={7} className="text-right tracking-widest">
                  Ongkir:
                </TableCell>
                <TableCell>{formatRupiah(Number(transaksi.ongkir))}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={7} className="text-right tracking-widest">
                  Total:
                </TableCell>
                <TableCell>
                  {formatRupiah(Number(transaksi.total_bayar))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default DetailTransaksiPage;
