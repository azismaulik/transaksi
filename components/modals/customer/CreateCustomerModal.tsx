"use client";

import React, { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SubmitButton from "../../SubmitButton";
import { addCustomer } from "@/lib/actions/customer.action";
import { toast } from "../../ui/use-toast";

const formSchema = z.object({
  kode: z
    .string()
    .min(1, { message: "Kode is required" })
    .max(10, { message: "Kode must be 10 characters or less" }),
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be 100 characters or less" }),
  telp: z
    .string()
    .min(1, { message: "Telephone number is required" })
    .max(20, { message: "Telephone number must be 20 characters or less" })
    .regex(/^[0-9]+$/, {
      message: "Telephone number must contain only digits",
    }),
});

const CreateCustomerModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const generateCode = useCallback(
    () => "CUST" + Math.floor(Math.random() * 10000).toString(),
    []
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kode: generateCode(),
      name: "",
      telp: "",
    },
  });

  const handleTelephoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    form.setValue("telp", value);
  };

  const resetForm = useCallback(() => {
    form.reset({
      kode: generateCode(),
      name: "",
      telp: "",
    });
  }, [form, generateCode]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await addCustomer(values);

    if (result.success) {
      toast({
        title: "Success",
        description: "Customer berhasil dibuat",
      });
      resetForm();
      setIsOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menambahkan customer",
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Tambah</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Customer</DialogTitle>
          <DialogDescription aria-hidden></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="kode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter customer code"
                      {...field}
                      maxLength={10}
                      disabled
                      readOnly
                    />
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama customer"
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
                  <FormLabel>No Telpon</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan no telpon customer"
                      {...field}
                      maxLength={20}
                      onChange={handleTelephoneInput}
                      inputMode="numeric"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton loadingText="Menambahkan...">
              Tambah Customer
            </SubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCustomerModal;
