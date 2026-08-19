import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AdminRole = "owner" | "admin" | "editor";

export interface AdminIdentity {
  user: { id: string; email: string };
  profile: { displayName: string; role: AdminRole };
}

export const getOptionalAdmin = cache(async (): Promise<AdminIdentity | null> => {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user?.email) return null;

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("display_name, role, active")
    .eq("user_id", user.id)
    .eq("active", true)
    .maybeSingle();

  if (!profile) return null;
  return {
    user: { id: user.id, email: user.email },
    profile: { displayName: profile.display_name, role: profile.role as AdminRole },
  };
});

export async function requireAdmin() {
  const admin = await getOptionalAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
