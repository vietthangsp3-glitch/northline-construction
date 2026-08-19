"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface LoginState { status: "idle" | "error"; message: string }

const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8).max(200),
});

export async function loginAdmin(_: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { status: "error", message: "Enter a valid email and password." };

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { status: "error", message: "Admin authentication is not configured." };

  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) return { status: "error", message: "Email or password is incorrect." };

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("active")
    .eq("user_id", data.user.id)
    .eq("active", true)
    .maybeSingle();

  if (!profile) {
    await supabase.auth.signOut();
    return { status: "error", message: "This account is not approved for admin access." };
  }

  redirect("/admin/dashboard");
}

export async function logoutAdmin() {
  const supabase = await createServerSupabaseClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}
