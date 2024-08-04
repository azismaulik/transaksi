"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { addProduct } from "@/lib/actions/barang.action";
import SubmitButton from "@/components/SubmitButton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  nama: z
    .string()
    .min(1, { message: "Silahkan isi nama barang" })
    .max(100, { message: "Nama tidak boleh lebih dari 100 karakter" }),
  harga: z.number().min(0, { message: "Harga tidak boleh negatif" }),
  stok: z.number().min(0, { message: "Stok tidak boleh negatif" }),
  kode: z.string().min(1, { message: "Silahkan isi kode barang" }),
  diskon: z.number().min(0).max(100).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddBarangModal() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const generateRandomKode = () => {
    const randomKode = Math.floor(Math.random() * 10000);
    return "BRG" + randomKode.toString().padStart(4, "0");
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      harga: 0,
      stok: 0,
      kode: generateRandomKode(),
      diskon: 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.setValue("kode", generateRandomKode());
    }
  }, [isOpen, form]);

  async function onSubmit(values: FormValues) {
    try {
      const result = await addProduct(values);
      if (result.success) {
        toast({
          title: "Barang berhasil dibuat",
          description: `${values.nama} telah ditambahkan ke database.`,
        });
        form.reset({
          nama: "",
          harga: 0,
          stok: 0,
          kode: generateRandomKode(),
          diskon: 0,
        });
        router.refresh();
        setIsOpen(false);
      } else {
        throw new Error("Failed to add product");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Terjadi kesalahan saat menambahkan data. Silahkan coba lagi.",
        variant: "destructive",
      });
    }
  }

  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: number) => void
  ) => {
    const value =
      e.target.value === "" ? 0 : Math.max(0, parseFloat(e.target.value));
    onChange(value);
    e.target.value = value.toString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Tambah</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Barang</DialogTitle>
          <DialogDescription aria-hidden></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full">
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama barang</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter product name"
                      {...field}
                      maxLength={100}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Barang</FormLabel>
                  <FormControl>
                    <Input
                      readOnly
                      disabled
                      placeholder="Enter product code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="harga"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter product price"
                      {...field}
                      onChange={(e) => handleNumberInput(e, field.onChange)}
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stok"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter product stock"
                      {...field}
                      onChange={(e) => handleNumberInput(e, field.onChange)}
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="diskon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diskon</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter product discount"
                      {...field}
                      onChange={(e) => handleNumberInput(e, field.onChange)}
                      min={0}
                      max={100}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <SubmitButton loadingText="Menambahkan...">
                Tambah Barang
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
