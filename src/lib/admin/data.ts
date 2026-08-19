import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const PAGE_SIZE = 12;

async function client() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured");
  return supabase;
}

export async function getDashboardData() {
  try {
    const supabase = await client();
    const monthStart = new Date();
    monthStart.setUTCDate(1); monthStart.setUTCHours(0, 0, 0, 0);
    const [allInquiries, newInquiries, monthInquiries, allProjects, publishedProjects, draftProjects, recentInquiries, recentProjects] = await Promise.all([
      supabase.from("inquiries").select("id", { count: "exact", head: true }),
      supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "received"),
      supabase.from("inquiries").select("id", { count: "exact", head: true }).gte("created_at", monthStart.toISOString()),
      supabase.from("projects").select("id", { count: "exact", head: true }).neq("status", "archived"),
      supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "draft"),
      supabase.from("inquiries").select("id,name,email,form_type,status,created_at").order("created_at", { ascending: false }).limit(6),
      supabase.from("projects").select("id,title,slug,status,updated_at").order("updated_at", { ascending: false }).limit(5),
    ]);
    const error = [allInquiries,newInquiries,monthInquiries,allProjects,publishedProjects,draftProjects,recentInquiries,recentProjects].find((item) => item.error)?.error;
    if (error) throw error;
    return { configured: true, counts: { inquiries: allInquiries.count ?? 0, newInquiries: newInquiries.count ?? 0, monthInquiries: monthInquiries.count ?? 0, projects: allProjects.count ?? 0, published: publishedProjects.count ?? 0, drafts: draftProjects.count ?? 0 }, recentInquiries: recentInquiries.data ?? [], recentProjects: recentProjects.data ?? [] };
  } catch {
    return { configured: false, counts: { inquiries: 0, newInquiries: 0, monthInquiries: 0, projects: 0, published: 0, drafts: 0 }, recentInquiries: [], recentProjects: [] };
  }
}

export async function getInquiries(params: { query?: string; status?: string; sort?: string; page?: string }) {
  const supabase = await client();
  const page = Math.max(1, Number(params.page) || 1);
  let query = supabase.from("inquiries").select("id,name,email,company,form_type,status,created_at", { count: "exact" });
  const search = (params.query || "").replace(/[,%()]/g, " ").trim();
  if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
  if (["received","delivered","delivery_failed","archived"].includes(params.status || "")) query = query.eq("status", params.status!);
  query = query.order("created_at", { ascending: params.sort === "oldest" }).range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  const { data, count, error } = await query;
  if (error) throw error;
  return { rows: data ?? [], total: count ?? 0, page, pages: Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE)) };
}

export async function getInquiry(id: string) {
  const supabase = await client();
  const [{ data, error }, notes] = await Promise.all([
    supabase.from("inquiries").select("id,form_type,name,email,phone,company,project_type,budget,location,timeline,message,status,email_delivery_id,created_at,updated_at").eq("id", id).maybeSingle(),
    supabase.from("inquiry_notes").select("id,body,author_id,created_at").eq("inquiry_id", id).order("created_at", { ascending: false }),
  ]);
  if (error) throw error;
  return { inquiry: data, notes: notes.data ?? [] };
}

export async function getAdminProjects() {
  const supabase = await client();
  const { data, error } = await supabase.from("projects").select("id,title,slug,category,location,completion_year,status,featured,updated_at").order("sort_order").order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getAdminProject(id: string) {
  const supabase = await client();
  const [{ data, error }, images] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).maybeSingle(),
    supabase.from("project_images").select("*").eq("project_id", id).order("sort_order"),
  ]);
  if (error) throw error;
  return data ? { ...data, project_images: images.data ?? [] } : null;
}

export async function getAdminServices() {
  const supabase = await client();
  const { data, error } = await supabase.from("services").select("*").order("sort_order").order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getAdminService(id: string) {
  const supabase = await client();
  const { data, error } = await supabase.from("services").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getSiteContent() {
  const supabase = await client();
  const { data, error } = await supabase.from("site_content").select("key,section,label,value,updated_at").order("section").order("key");
  if (error) throw error;
  return data ?? [];
}

export async function getSiteSettings() {
  const supabase = await client();
  const { data, error } = await supabase.from("site_settings").select("key,label,value,is_public,updated_at").order("key");
  if (error) throw error;
  return data ?? [];
}

export async function getMediaAssets() {
  const supabase = await client();
  const { data, error } = await supabase.from("media_assets").select("id,storage_path,public_url,file_name,mime_type,size_bytes,width,height,alt_text,created_at").order("created_at", { ascending: false }).limit(100);
  if (error) throw error;
  return data ?? [];
}
