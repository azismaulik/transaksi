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
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

const menus = [
  {
    path: "/",
    label: "Transaksi",
  },
  {
    path: "/barang",
    label: "Barang",
  },
  {
    path: "/customer",
    label: "Customer",
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <>
      <Sheet>
        <SheetTrigger className="lg:hidden p-4">
          <Menu />
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle className="text-4xl font-bold">Azis.</SheetTitle>
            <SheetDescription>
              <span hidden>Menu navigasi</span>
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-1 w-full mt-10">
            {menus.map((menu) => (
              <Link
                key={menu.path}
                className={cn(
                  "w-full font-semibold py-2 px-4 rounded hover:bg-primary transition-all hover:text-white",
                  {
                    "bg-primary text-white": pathname === menu.path,
                  }
                )}
                href={menu.path}>
                {menu.label}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <aside className="hidden lg:block h-screen sticky top-0 bottom-0 p-4 border-r">
        <h1 className="text-4xl font-bold">Azis.</h1>
        <div className="flex flex-col gap-1 w-full mt-10">
          {menus.map((menu) => (
            <Link
              key={menu.path}
              className={cn(
                "w-full font-semibold py-2 px-4 rounded hover:bg-primary transition-all hover:text-white",
                {
                  "bg-primary text-white": pathname === menu.path,
                }
              )}
              href={menu.path}>
              {menu.label}
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
