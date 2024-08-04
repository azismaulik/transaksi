import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="w-full lg:grid lg:grid-cols-[234px_1fr]">
          <Sidebar />
          <main className="p-4 flex-1 overflow-x-hidden">
            {children}
            <Toaster />
          </main>
        </div>
      </body>
    </html>
  );
}
