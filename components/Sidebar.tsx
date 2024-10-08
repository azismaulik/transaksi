"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ArrowRightLeft,
  ContactRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

const menus = [
  {
    path: "/",
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    path: "/transaksi",
    label: "Transaksi",
    icon: <ArrowRightLeft size={20} />,
  },
  {
    path: "/barang",
    label: "Barang",
    icon: <Package size={20} />,
  },
  {
    path: "/customer",
    label: "Customer",
    icon: <ContactRound size={20} />,
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
        throw new Error("Failed to log out");
      } else {
        router.push("/login");
        toast({
          title: "Success",
          description: "Logged out successfully",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className="lg:hidden p-4">
          <Menu />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex flex-col justify-between h-screen">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-left">
              Azis.
            </SheetTitle>
            <SheetDescription>
              <span hidden>Menu navigasi</span>
            </SheetDescription>
          </SheetHeader>
          <div className="mb-auto space-y-3">
            {menus.map((menu) => (
              <Link
                key={menu.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "w-full font-semibold py-2 hover:px-4 rounded hover:bg-primary transition-all hover:text-white flex gap-4 items-center",
                  {
                    "bg-primary text-white px-4": pathname === menu.path,
                  }
                )}
                href={menu.path}>
                <span>{menu.icon}</span>
                <span>{menu.label}</span>
              </Link>
            ))}
          </div>
          <Button className="w-full mt-auto" onClick={handleLogout}>
            <LogOut className="mr-2 size-5" />
            Logout
          </Button>
        </SheetContent>
      </Sheet>

      <aside className="hidden lg:flex flex-col justify-between h-screen sticky top-0 bottom-0 p-4 border-r shadow">
        <h1 className="text-4xl font-bold">Azis.</h1>
        <div className="flex flex-col gap-2 w-full mt-10">
          {menus.map((menu) => (
            <Link
              key={menu.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "w-full font-semibold py-2 hover:px-4 rounded hover:bg-primary transition-all hover:text-white flex gap-4 items-center",
                {
                  "bg-primary text-white px-4": pathname === menu.path,
                }
              )}
              href={menu.path}>
              <span>{menu.icon}</span>
              <span>{menu.label}</span>
            </Link>
          ))}
        </div>
        <Button className="w-full mt-auto" onClick={handleLogout}>
          <LogOut className="mr-2 size-5" />
          Logout
        </Button>
      </aside>
    </>
  );
};

export default Sidebar;
