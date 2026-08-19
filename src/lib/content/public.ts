import "server-only";
import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { projects as fallbackProjects } from "@/data/projects";
import { services as fallbackServices } from "@/data/services";
import type { Project, ProjectCategory, Service } from "@/types/content";
import { getSupabaseServerConfig } from "@/lib/supabase/config";

function contentClient() {
  const config = getSupabaseServerConfig();
  if (!config) return null;
  return createClient(config.url, config.key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
}

function image(src: string | null, alt: string | null, width?: number | null, height?: number | null) {
  return { src: src || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=85", alt: alt || "Northline construction project", width: width || 1800, height: height || 1200 };
}

export const getPublicProjects = cache(async (): Promise<Project[]> => {
  const supabase = contentClient(); if (!supabase) return fallbackProjects;
  try {
    const { data, error } = await supabase.from("projects").select("*,project_images(public_url,alt_text,width,height,sort_order)").order("sort_order").order("updated_at", { ascending: false });
    if (error || !data?.length) return fallbackProjects;
    const bySlug = new Map(data.map((row) => [row.slug, row]));
    const managed = data.filter((row) => row.status === "published").map((row): Project => ({
      slug: row.slug, name: row.title, location: row.location || "", category: row.category as ProjectCategory, year: row.completion_year || new Date().getFullYear(), size: row.project_size || "—", delivery: row.delivery_method || "—", client: row.client_name || "Private Client",
      summary: row.summary, story: row.story?.length ? row.story : [row.description || row.summary], challenge: row.challenge || "Every project begins with a clear understanding of constraints.", approach: row.approach || "Northline aligns the team around quality, logistics, and accountable delivery.", outcome: row.outcome || "A durable result shaped around the client's priorities.",
      cover: image(row.hero_image_url, row.hero_image_alt, row.hero_image_width, row.hero_image_height), gallery: (row.project_images || []).sort((a:{sort_order:number},b:{sort_order:number})=>a.sort_order-b.sort_order).map((item:{public_url:string;alt_text:string;width:number|null;height:number|null})=>image(item.public_url,item.alt_text,item.width,item.height)),
      metrics: Array.isArray(row.metrics) ? row.metrics : [], featured: row.featured,
    })).map((project) => ({ ...project, gallery: project.gallery.length >= 2 ? project.gallery : [project.cover, project.cover] }));
    const untouched = fallbackProjects.filter((project) => !bySlug.has(project.slug));
    return [...managed, ...untouched];
  } catch { return fallbackProjects; }
});

export async function getPublicProject(slug: string) { return (await getPublicProjects()).find((project) => project.slug === slug); }

export const getPublicServices = cache(async (): Promise<Service[]> => {
  const supabase = contentClient(); if (!supabase) return fallbackServices;
  try {
    const { data, error } = await supabase.from("services").select("*").order("sort_order").order("updated_at", { ascending: false });
    if (error || !data?.length) return fallbackServices;
    const bySlug = new Map(data.map((row) => [row.slug, row]));
    const managed = data.filter((row) => row.active).map((row): Service => ({ slug: row.slug, name: row.title, number: row.number, summary: row.summary, introduction: row.description || row.summary,
      capabilities: row.capabilities || [], relatedProjectSlugs: row.related_project_slugs || [], image: image(row.image_url, row.image_alt, row.image_width, row.image_height) }));
    return [...managed, ...fallbackServices.filter((service) => !bySlug.has(service.slug))];
  } catch { return fallbackServices; }
});

export async function getPublicService(slug: string) { return (await getPublicServices()).find((service) => service.slug === slug); }

export const getPublicContent = cache(async () => {
  const supabase = contentClient(); if (!supabase) return {} as Record<string, unknown>;
  try { const { data, error } = await supabase.from("site_content").select("key,value"); if (error) return {}; return Object.fromEntries((data || []).map((item) => [item.key, item.value])); }
  catch { return {}; }
});

export const getPublicSettings = cache(async () => {
  const supabase = contentClient(); if (!supabase) return {} as Record<string, unknown>;
  try { const { data, error } = await supabase.from("site_settings").select("key,value").eq("is_public", true); if (error) return {}; return Object.fromEntries((data || []).map((item) => [item.key, item.value])); }
  catch { return {}; }
});
