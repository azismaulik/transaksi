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
import { Customer } from "@prisma/client";
import SubmitButton from "@/components/SubmitButton";
import { deleteCustomer } from "@/lib/actions/customer.action";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

const DeleteModalCustomer = ({ customer }: { customer: Customer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hapusCustomer = async () => {
    const result = await deleteCustomer(customer.id);
    if (result.success) {
      toast({
        title: `${customer.name} telah dihapus`,
      });
      setIsOpen(false);
    } else {
      toast({
        title: `Gagal Menghapus ${customer.name}`,
      });
      setIsOpen(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          <Trash className="w-4 h-4 mr-2" /> Hapus
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yakin Ingin Menghapus {customer.name}?</DialogTitle>
          <DialogDescription>
            Setelah di hapus, data tidak dapat dikembalikan. Harap berhati hati
            untuk menghapus data
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Batal</Button>
          </DialogClose>
          <form action={hapusCustomer}>
            <SubmitButton loadingText="Menghapus" variant="destructive">
              Hapus
            </SubmitButton>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModalCustomer;
