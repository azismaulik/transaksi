import Sidebar from "@/components/Sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
  return (
    <div className="w-full lg:grid lg:grid-cols-[250px_1fr] gap-4">
      <Sidebar />
      <main className="p-4 flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
};

export default DashboardLayout;
