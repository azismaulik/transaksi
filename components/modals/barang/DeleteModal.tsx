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
import { Barang } from "@prisma/client";
import SubmitButton from "@/components/SubmitButton";
import { deleteProduct } from "@/lib/actions/barang.action";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

const DeleteModal = ({ barang }: { barang: Barang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hapusBarang = async () => {
    const result = await deleteProduct(barang.id);
    if (result.success) {
      toast({
        title: `${barang.nama} telah dihapus`,
      });
      setIsOpen(false);
    } else {
      toast({
        title: `Gagal Menghapus ${barang.nama}`,
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
          <DialogTitle>Yakin Ingin Menghapus {barang.nama}?</DialogTitle>
          <DialogDescription>
            Setelah di hapus, data tidak dapat dikembalikan. Harap berhati hati
            untuk menghapus data
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Batal</Button>
          </DialogClose>
          <form action={hapusBarang}>
            <SubmitButton loadingText="Menghapus" variant="destructive">
              Hapus
            </SubmitButton>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
