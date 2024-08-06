"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah } from "@/lib/helper/formatRupiah";
import { Barang } from "@prisma/client";
import DeleteModal from "@/components/modals/barang/DeleteModal";
import AddBarangModal from "@/components/modals/barang/AddBarangModal";
import EditModal from "@/components/modals/barang/EditModal";

export const columns: ColumnDef<Barang>[] = [
  {
    header: "No",
    id: "rowNumber",
  },
  {
    accessorKey: "kode",
    header: "Kode",
    cell: ({ row }) => <div>{row.getValue("kode")}</div>,
  },
  {
    accessorKey: "nama",
    header: "Nama Barang",
    cell: ({ row }) => <div>{row.getValue("nama")}</div>,
  },
  {
    accessorKey: "stok",
    header: () => <div>Stok</div>,
    cell: ({ row }) => {
      const stok = parseFloat(row.getValue("stok"));
      return <div>{stok}</div>;
    },
  },
  {
    accessorKey: "harga",
    header: () => <div className="text-right">Harga</div>,
    cell: ({ row }) => {
      const harga = parseFloat(row.getValue("harga"));
      return (
        <div className="text-right font-medium">{formatRupiah(harga)}</div>
      );
    },
  },
  {
    accessorKey: "diskon",
    header: () => <div className="text-right">Diskon (%)</div>,
    cell: ({ row }) => {
      const diskonPersen = parseFloat(row.getValue("diskon"));
      return (
        <div className="text-right">
          {diskonPersen === 0 ? "-" : `${diskonPersen}%`}
        </div>
      );
    },
  },
  {
    accessorKey: "diskon_rupiah",
    header: () => <div className="text-right">Diskon (Rp)</div>,
    cell: ({ row }) => {
      const diskonRupiah =
        (parseFloat(row.getValue("diskon")) / 100) *
        parseFloat(row.getValue("harga"));
      return (
        <div className="text-right">
          {diskonRupiah === 0 ? "-" : formatRupiah(diskonRupiah)}
        </div>
      );
    },
  },
  {
    id: "harga_setelah_diskon",
    header: () => <div className="text-right">Harga Setelah Diskon</div>,
    cell: ({ row }) => {
      const harga = parseFloat(row.getValue("harga"));
      const diskonRupiah = (parseFloat(row.getValue("diskon")) / 100) * harga;
      const hargaSetelahDiskon = harga - diskonRupiah;
      return (
        <div className="text-right font-medium">
          {formatRupiah(hargaSetelahDiskon)}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const barang = row.original;

      return (
        <div className="flex gap-2 items-center">
          <EditModal barang={barang} />
          <DeleteModal barang={barang} />
        </div>
      );
    },
  },
];

export function BarangTable({ data }: { data: Barang[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4 gap-4">
        <AddBarangModal />
        <Input
          placeholder="Cari nama barang..."
          value={(table.getColumn("nama")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nama")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <React.Fragment key={cell.id}>
                      <TableCell>
                        {cell.column.id === "rowNumber" && index + 1}
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    </React.Fragment>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
