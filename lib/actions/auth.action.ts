"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export async function login(data: z.infer<typeof authSchema>) {
  const validatedData = authSchema.parse(data);
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword(validatedData);

  if (error) {
    console.error("Login error:", error);
    throw new Error("Akun tidak ditemukan");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error);
    throw new Error("Failed to log out");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
