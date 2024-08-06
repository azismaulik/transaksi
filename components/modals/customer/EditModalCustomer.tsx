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
import { Customer } from "@prisma/client";
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
import { updateCustomer } from "@/lib/actions/customer.action";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Silahkan isi nama customer" })
    .max(100, { message: "Nama tidak boleh lebih dari 100 karakter" }),
  kode: z.string().min(1, { message: "Silahkan isi kode customer" }),
  telp: z
    .string()
    .min(1, { message: "Silahkan isi nomor telepon customer" })
    .regex(/^[0-9]+$/, { message: "Nomor telepon hanya boleh berisi angka" }),
});

type FormValues = z.infer<typeof formSchema>;

const EditModalCustomer = ({ customer }: { customer: Customer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kode: customer.kode,
      name: customer.name,
      telp: customer.telp,
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const result = await updateCustomer(customer.id, values);
      if (result.success) {
        toast({
          title: "customer berhasil diedit",
          description: `${values.name} telah berhasil di edit ke database.`,
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

  const handleTelephoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    form.setValue("telp", value);
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
          <DialogTitle>Edit {customer.name}</DialogTitle>
          <DialogDescription aria-hidden></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full"
          >
            <FormField
              control={form.control}
              name="kode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode customer</FormLabel>
                  <FormControl>
                    <Input disabled readOnly {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama customer</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan Nama customer"
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
              name="telp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telepon customer</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nomor telepon"
                      {...field}
                      onChange={handleTelephoneInput}
                      inputMode="numeric"
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
                  className="bg-green-600 hover:bg-green-600/90"
                >
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

export default EditModalCustomer;
