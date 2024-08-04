"use client";

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
import { Barang } from "@prisma/client";
import SubmitButton from "@/components/SubmitButton";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Edit } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateProduct } from "@/lib/actions/barang.action";

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

const EditModalProduct = ({ barang }: { barang: Barang }) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: barang.nama,
      harga: Number(barang.harga),
      stok: barang.stok,
      kode: barang.kode,
      diskon: barang.diskon,
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const result = await updateProduct(barang.id, values);
      if (result.success) {
        toast({
          title: "Barang berhasil diedit",
          description: `${values.nama} telah berhasil di edit ke database.`,
        });
        setIsOpen(false);
      } else {
        throw new Error("Failed to update product");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Terjadi kesalahan saat mengedit data. Silahkan coba lagi.",
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
        <Button size="sm" className="bg-green-600 hover:bg-green-600/90">
          <Edit className="w-4 h-4 mr-2" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {barang.nama}</DialogTitle>
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
                      placeholder="Masukkan Nama Barang"
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
                  <FormLabel>Kode barang</FormLabel>
                  <FormControl>
                    <Input disabled readOnly {...field} />
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
                  <FormLabel>Harga barang</FormLabel>
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
                  <FormLabel>Diskon {"(%)"}</FormLabel>
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
              <div className="flex gap-2 items-center">
                <DialogClose asChild>
                  <Button variant="secondary">Batal</Button>
                </DialogClose>
                <SubmitButton
                  loadingText="Menyimpan..."
                  className="bg-green-600 hover:bg-green-600/90">
                  Simpan
                </SubmitButton>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditModalProduct;
