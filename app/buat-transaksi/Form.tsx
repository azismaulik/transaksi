"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import SubmitButton from "@/components/SubmitButton";
import { Barang, Customer } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah } from "@/lib/helper/formatRupiah";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  kode: z
    .string()
    .min(1, { message: "Kode is required" })
    .max(15, { message: "Kode must be 15 characters or less" }),
  tanggal: z.string().min(1, { message: "Tanggal is required" }),
  customer_id: z.string().min(1, { message: "Customer is required" }),
  subtotal: z.number().min(0, { message: "Subtotal must be 0 or greater" }),
  diskon_persen: z
    .number()
    .min(0)
    .max(100, { message: "Diskon must be between 0 and 100" }),
  diskon_amount: z
    .number()
    .min(0, { message: "Diskon amount must be 0 or greater" }),
  ongkir: z.number().min(0, { message: "Ongkir must be 0 or greater" }),
  total_bayar: z
    .number()
    .min(0, { message: "Total bayar must be 0 or greater" }),
});

type FormValues = z.infer<typeof formSchema>;

const CreateTransactionForm = ({
  customers,
  products,
}: {
  customers: Customer[];
  products: Barang[];
}) => {
  const [barangs, setBarangs] = useState<(Barang & { qty: number })[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kode: "TRX" + Math.floor(Math.random() * 1000000),
      tanggal: new Date().toISOString().split("T")[0],
      customer_id: "",
      subtotal: 0,
      diskon_persen: 0,
      diskon_amount: 0,
      ongkir: 0,
      total_bayar: 0,
    },
  });

  const handleBarangChange = (value: string) => {
    const selectedBarang = products.find(
      (barang) => barang.id.toString() === value
    );
    if (selectedBarang) {
      setBarangs((prevBarangs) => {
        const existingBarang = prevBarangs.find(
          (b) => b.id === selectedBarang.id
        );
        if (existingBarang) {
          return prevBarangs.map((b) =>
            b.id === selectedBarang.id ? { ...b, qty: b.qty + 1 } : b
          );
        } else {
          return [...prevBarangs, { ...selectedBarang, qty: 1 }];
        }
      });
    }
  };

  const handleRemoveBarang = (id: number) => {
    setBarangs((prevBarangs) => prevBarangs.filter((b) => b.id !== id));
  };

  const handleQuantityChange = (id: number, newQty: number) => {
    setBarangs((prevBarangs) =>
      prevBarangs.map((b) => (b.id === id ? { ...b, qty: newQty } : b))
    );
  };

  const handleDiskonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseFloat(value);
    if (value === "" || isNaN(numValue)) {
      form.setValue("diskon_persen", 0);
    } else {
      form.setValue("diskon_persen", Math.max(0, Math.min(100, numValue)));
    }
  };

  const handleOngkirChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseFloat(value);
    if (value === "" || isNaN(numValue)) {
      form.setValue("ongkir", 0);
    } else {
      form.setValue("ongkir", Math.max(0, numValue));
    }
  };

  const calculateSubtotal = () => {
    return barangs.reduce((total, barang) => {
      const discountedPrice = Number(barang.harga) * (1 - barang.diskon / 100);
      return total + discountedPrice * barang.qty;
    }, 0);
  };

  useEffect(() => {
    const subtotal = calculateSubtotal();
    form.setValue("subtotal", subtotal);
    updateTotalBayar(
      subtotal,
      form.getValues("diskon_persen"),
      form.getValues("ongkir")
    );
  }, [barangs]);

  const updateTotalBayar = (
    subtotal: number,
    diskonPersen: number,
    ongkir: number
  ) => {
    const diskonAmount = (subtotal * diskonPersen) / 100;
    const total = subtotal - diskonAmount + ongkir;
    form.setValue("diskon_amount", diskonAmount);
    form.setValue("total_bayar", total);
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "diskon_persen" || name === "ongkir") {
        updateTotalBayar(
          form.getValues("subtotal"),
          form.getValues("diskon_persen"),
          form.getValues("ongkir")
        );
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  async function onSubmit(values: FormValues) {
    // Implementation for form submission
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 md:py-10">
        <FormField
          control={form.control}
          name="kode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kode</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tanggal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="customer_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Customer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem
                      key={customer.id}
                      value={customer.id.toString()}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="product"
          render={() => (
            <FormItem>
              <FormLabel>Barang</FormLabel>
              <Select onValueChange={handleBarangChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Barang" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {barangs.length > 0 && (
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Kode Barang</TableHead>
                <TableHead>Nama Barang</TableHead>
                <TableHead>Harga Banderol</TableHead>
                <TableHead>Diskon Perbarang (%)</TableHead>
                <TableHead>QTY</TableHead>
                <TableHead>Harga Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {barangs.map((barang) => (
                <TableRow key={barang.id}>
                  <TableCell>{barang.kode}</TableCell>
                  <TableCell className="truncate">{barang.nama}</TableCell>
                  <TableCell>{formatRupiah(Number(barang.harga))}</TableCell>
                  <TableCell>{barang.diskon}%</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={barang.qty}
                      onChange={(e) =>
                        handleQuantityChange(
                          barang.id,
                          parseInt(e.target.value) || 0
                        )
                      }
                      min={1}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    {formatRupiah(
                      Number(barang.harga) *
                        (1 - barang.diskon / 100) *
                        barang.qty
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => handleRemoveBarang(barang.id)}>
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <FormField
          control={form.control}
          name="subtotal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtotal</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  value={formatRupiah(field.value)}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="diskon_persen"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diskon (%)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={handleDiskonChange}
                  onBlur={() => {
                    if (field.value === 0) {
                      form.setValue("diskon_persen", 0);
                    }
                  }}
                  min={0}
                  max={100}
                  step="0.01"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="diskon_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diskon Amount</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  value={formatRupiah(field.value)}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ongkir"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ongkir</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={handleOngkirChange}
                  onBlur={() => {
                    if (field.value === 0) {
                      form.setValue("ongkir", 0);
                    }
                  }}
                  min={0}
                  step="1"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="total_bayar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Bayar</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  value={formatRupiah(field.value)}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton loadingText="Adding transaction...">
          Add Transaction
        </SubmitButton>
      </form>
    </Form>
  );
};

export default CreateTransactionForm;
