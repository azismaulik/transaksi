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
import { ArrowUpDown } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Customer, Sales } from "@prisma/client";
import { formatRupiah } from "@/lib/helper/formatRupiah";
import { formatDate } from "@/lib/helper/formatDate";

type SalesWithCustomer = Sales & {
  customer: Customer;
};

export const columns: ColumnDef<SalesWithCustomer>[] = [
  {
    header: "No",
    id: "rowNumber",
  },
  {
    accessorKey: "kode",
    header: "Kode Transaksi",
    cell: ({ row }) => <div>{row.getValue("kode")}</div>,
  },
  {
    accessorKey: "tgl",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Tanggal
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{formatDate(row.getValue("tgl"))}</div>,
  },
  {
    accessorKey: "customer",
    header: "Nama Costumer",
    cell: ({ row }) => <div>{row.original.customer.name}</div>,
  },
  {
    accessorKey: "subtotal",
    header: () => <div className="text-right">Subtotal</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("subtotal"));
      return (
        <div className="text-right font-medium">{formatRupiah(amount)}</div>
      );
    },
  },
  {
    accessorKey: "diskon",
    header: () => <div className="text-right">Diskon (%)</div>,
    cell: ({ row }) => {
      const diskon = parseFloat(row.getValue("diskon"));

      return <div className="text-right font-medium">{diskon}%</div>;
    },
  },
  {
    accessorKey: "diskon_rupiah",
    header: () => <div className="text-right">Diskon (Rp)</div>,
    cell: ({ row }) => {
      const diskon = parseFloat(row.getValue("diskon"));

      const amount = parseFloat(row.getValue("subtotal")) * (diskon / 100);

      return (
        <div className="text-right font-medium">{formatRupiah(amount)}</div>
      );
    },
  },
  {
    accessorKey: "ongkir",
    header: () => <div className="text-right">Ongkir</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("ongkir"));

      return (
        <div className="text-right font-medium">{formatRupiah(amount)}</div>
      );
    },
  },
  {
    accessorKey: "total_bayar",
    header: () => <div className="text-right">Total Bayar</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total_bayar"));

      return (
        <div className="text-right font-medium">{formatRupiah(amount)}</div>
      );
    },
  },
  {
    accessorKey: "id",
    header: () => <div hidden>Aksi</div>,
    cell: ({ row }) => {
      return (
        <Link
          className={buttonVariants({ size: "sm", variant: "link" })}
          href={`/transaksi/${row.getValue("id")}`}>
          Lihat Detail
        </Link>
      );
    },
  },
];

export function TransactionTable({ data }: { data: SalesWithCustomer[] }) {
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
        <Link
          className={buttonVariants({ variant: "default" })}
          href="transaksi/buat">
          Buat Transaksi
        </Link>
        <Input
          placeholder="Cari..."
          value={(table.getColumn("kode")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("kode")?.setFilterValue(event.target.value)
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
                  key={index}
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <React.Fragment key={cell.id}>
                      <TableCell key={cell.id}>
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
                  className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
