"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { projects as starterProjects } from "@/data/projects";
import { services as starterServices } from "@/data/services";
import { requireAdmin } from "@/lib/admin/auth";
import { projectSchema, serviceSchema } from "@/lib/admin/schemas";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function authorized() {
  const admin = await requireAdmin();
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured");
  return { admin, supabase };
}

const lines = (value: string) => value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
const checkbox = (form: FormData, name: string) => form.get(name) === "on";

export async function updateInquiryStatus(formData: FormData) {
  const parsed = z.object({ id: z.string().uuid(), status: z.enum(["received","delivered","delivery_failed","archived"]) }).parse({ id: formData.get("id"), status: formData.get("status") });
  const { supabase } = await authorized();
  const { error } = await supabase.from("inquiries").update({ status: parsed.status }).eq("id", parsed.id);
  if (error) throw new Error("Unable to update inquiry status");
  revalidatePath(`/admin/inquiries/${parsed.id}`); revalidatePath("/admin/inquiries"); revalidatePath("/admin/dashboard");
}

export async function addInquiryNote(formData: FormData) {
  const parsed = z.object({ inquiryId: z.string().uuid(), body: z.string().trim().min(1).max(2000) }).parse({ inquiryId: formData.get("inquiryId"), body: formData.get("body") });
  const { admin, supabase } = await authorized();
  const { error } = await supabase.from("inquiry_notes").insert({ inquiry_id: parsed.inquiryId, body: parsed.body, author_id: admin.user.id });
  if (error) throw new Error("Unable to save note");
  revalidatePath(`/admin/inquiries/${parsed.inquiryId}`);
}

export async function saveProject(formData: FormData) {
  const yearValue = String(formData.get("completionYear") || "").trim();
  const parsed = projectSchema.parse({
    id: formData.get("id") || undefined, slug: formData.get("slug"), title: formData.get("title"), summary: formData.get("summary"), description: formData.get("description") || "",
    story: formData.get("story") || "", challenge: formData.get("challenge") || "", approach: formData.get("approach") || "", outcome: formData.get("outcome") || "",
    clientName: formData.get("clientName") || "", location: formData.get("location") || "", category: formData.get("category") || "Commercial", completionYear: yearValue ? Number(yearValue) : null,
    projectSize: formData.get("projectSize") || "", deliveryMethod: formData.get("deliveryMethod") || "", services: formData.get("services") || "", heroImageUrl: formData.get("heroImageUrl") || "",
    heroImageAlt: formData.get("heroImageAlt") || "", gallery: formData.get("gallery") || "", metrics: formData.get("metrics") || "", seoTitle: formData.get("seoTitle") || "",
    seoDescription: formData.get("seoDescription") || "", status: formData.get("status"), featured: checkbox(formData, "featured"), sortOrder: formData.get("sortOrder") || 0,
  });
  const { admin, supabase } = await authorized();
  const metricRows = lines(parsed.metrics).map((row) => { const [value, ...label] = row.split("|"); return { value: value.trim(), label: label.join("|").trim() }; }).filter((item) => item.value && item.label);
  const payload = { slug: parsed.slug, title: parsed.title, summary: parsed.summary, description: parsed.description, story: lines(parsed.story), challenge: parsed.challenge, approach: parsed.approach, outcome: parsed.outcome,
    client_name: parsed.clientName, location: parsed.location, category: parsed.category, completion_year: parsed.completionYear, project_size: parsed.projectSize, delivery_method: parsed.deliveryMethod,
    services: lines(parsed.services), hero_image_url: parsed.heroImageUrl, hero_image_alt: parsed.heroImageAlt, metrics: metricRows, seo_title: parsed.seoTitle, seo_description: parsed.seoDescription,
    status: parsed.status, featured: parsed.featured, sort_order: parsed.sortOrder, updated_by: admin.user.id };
  let projectId = parsed.id;
  if (projectId) {
    const { data, error } = await supabase.from("projects").update(payload).eq("id", projectId).select("id").single();
    if (error || !data) throw new Error("Unable to update project");
  } else {
    const { data, error } = await supabase.from("projects").insert({ ...payload, created_by: admin.user.id }).select("id").single();
    if (error || !data) throw new Error("Unable to create project");
    projectId = data.id;
  }
  const gallery = lines(parsed.gallery).map((row, index) => { const [url, ...alt] = row.split("|"); return { project_id: projectId!, public_url: url.trim(), alt_text: alt.join("|").trim(), sort_order: index }; }).filter((item) => item.public_url);
  const { error: deleteError } = await supabase.from("project_images").delete().eq("project_id", projectId);
  if (deleteError) throw new Error("Unable to update project gallery");
  if (gallery.length) { const { error } = await supabase.from("project_images").insert(gallery); if (error) throw new Error("Unable to save project gallery"); }
  revalidatePath("/"); revalidatePath("/projects"); revalidatePath(`/projects/${parsed.slug}`); revalidatePath("/admin/projects");
  redirect(`/admin/projects/${projectId}?saved=1`);
}

export async function archiveProject(formData: FormData) {
  const id = z.string().uuid().parse(formData.get("id"));
  const { admin, supabase } = await authorized();
  const { error } = await supabase.from("projects").update({ status: "archived", updated_by: admin.user.id }).eq("id", id);
  if (error) throw new Error("Unable to archive project");
  revalidatePath("/"); revalidatePath("/projects"); revalidatePath("/admin/projects"); redirect("/admin/projects");
}

export async function saveService(formData: FormData) {
  const parsed = serviceSchema.parse({ id: formData.get("id") || undefined, slug: formData.get("slug"), title: formData.get("title"), number: formData.get("number"), summary: formData.get("summary"),
    description: formData.get("description") || "", capabilities: formData.get("capabilities") || "", relatedProjects: formData.get("relatedProjects") || "", imageUrl: formData.get("imageUrl") || "",
    imageAlt: formData.get("imageAlt") || "", seoTitle: formData.get("seoTitle") || "", seoDescription: formData.get("seoDescription") || "", active: checkbox(formData, "active"), featured: checkbox(formData, "featured"), sortOrder: formData.get("sortOrder") || 0 });
  const { admin, supabase } = await authorized();
  const payload = { slug: parsed.slug, title: parsed.title, number: parsed.number, summary: parsed.summary, description: parsed.description, capabilities: lines(parsed.capabilities), related_project_slugs: lines(parsed.relatedProjects),
    image_url: parsed.imageUrl, image_alt: parsed.imageAlt, seo_title: parsed.seoTitle, seo_description: parsed.seoDescription, active: parsed.active, featured: parsed.featured, sort_order: parsed.sortOrder, updated_by: admin.user.id };
  let id = parsed.id;
  if (id) { const { error } = await supabase.from("services").update(payload).eq("id", id); if (error) throw new Error("Unable to update service"); }
  else { const { data, error } = await supabase.from("services").insert({ ...payload, created_by: admin.user.id }).select("id").single(); if (error || !data) throw new Error("Unable to create service"); id = data.id; }
  revalidatePath("/"); revalidatePath("/services"); revalidatePath(`/services/${parsed.slug}`); revalidatePath("/admin/services"); redirect(`/admin/services/${id}?saved=1`);
}

export async function importStarterContent() {
  const { admin, supabase } = await authorized();
  const projectRows = starterProjects.map((project, index) => ({ slug: project.slug, title: project.name, summary: project.summary, description: project.story.join("\n\n"), story: project.story, challenge: project.challenge, approach: project.approach, outcome: project.outcome,
    client_name: project.client, location: project.location, category: project.category, completion_year: project.year, project_size: project.size, delivery_method: project.delivery, hero_image_url: project.cover.src, hero_image_alt: project.cover.alt,
    hero_image_width: project.cover.width, hero_image_height: project.cover.height, metrics: project.metrics, status: "published", featured: project.featured, sort_order: index, created_by: admin.user.id, updated_by: admin.user.id }));
  const serviceRows = starterServices.map((service, index) => ({ slug: service.slug, title: service.name, number: service.number, summary: service.summary, description: service.introduction, capabilities: service.capabilities,
    related_project_slugs: service.relatedProjectSlugs, image_url: service.image.src, image_alt: service.image.alt, image_width: service.image.width, image_height: service.image.height, active: true, featured: index < 3, sort_order: index, created_by: admin.user.id, updated_by: admin.user.id }));
  const { error: projectError } = await supabase.from("projects").upsert(projectRows, { onConflict: "slug", ignoreDuplicates: true });
  const { error: serviceError } = await supabase.from("services").upsert(serviceRows, { onConflict: "slug", ignoreDuplicates: true });
  if (projectError || serviceError) throw new Error("Unable to import starter content");
  const { data: inserted } = await supabase.from("projects").select("id,slug").in("slug", starterProjects.map((item) => item.slug));
  for (const project of starterProjects) {
    const id = inserted?.find((item) => item.slug === project.slug)?.id;
    if (!id) continue;
    const { count } = await supabase.from("project_images").select("id", { count: "exact", head: true }).eq("project_id", id);
    if (!count) await supabase.from("project_images").insert(project.gallery.map((image, index) => ({ project_id: id, public_url: image.src, alt_text: image.alt, width: image.width, height: image.height, sort_order: index })));
  }
  revalidatePath("/"); revalidatePath("/projects"); revalidatePath("/services"); revalidatePath("/admin/dashboard"); revalidatePath("/admin/projects"); revalidatePath("/admin/services");
}

export async function saveContentItem(formData: FormData) {
  const parsed = z.object({ key: z.string().min(2).max(120), section: z.string().min(2).max(80), label: z.string().min(2).max(120), value: z.string().max(20000) }).parse(Object.fromEntries(formData));
  let value: unknown; try { value = JSON.parse(parsed.value); } catch { throw new Error("Content value must be valid JSON"); }
  const { admin, supabase } = await authorized();
  const { error } = await supabase.from("site_content").upsert({ key: parsed.key, section: parsed.section, label: parsed.label, value, updated_by: admin.user.id });
  if (error) throw new Error("Unable to save content"); revalidatePath("/"); revalidatePath("/admin/content");
}

export async function saveSetting(formData: FormData) {
  const parsed = z.object({ key: z.string().min(2).max(120), label: z.string().min(2).max(120), value: z.string().max(20000), isPublic: z.string().optional() }).parse(Object.fromEntries(formData));
  let value: unknown; try { value = JSON.parse(parsed.value); } catch { throw new Error("Setting value must be valid JSON"); }
  const { admin, supabase } = await authorized();
  const { error } = await supabase.from("site_settings").upsert({ key: parsed.key, label: parsed.label, value, is_public: parsed.isPublic === "on", updated_by: admin.user.id });
  if (error) throw new Error("Unable to save setting"); revalidatePath("/admin/settings");
}

export async function uploadMedia(formData: FormData) {
  const file = formData.get("file"); const alt = String(formData.get("alt") || "").trim().slice(0, 300);
  if (!(file instanceof File) || file.size === 0) throw new Error("Choose an image to upload");
  const allowed = ["image/jpeg","image/png","image/webp","image/avif"];
  if (!allowed.includes(file.type) || file.size > 8 * 1024 * 1024) throw new Error("Use a JPG, PNG, WebP, or AVIF image up to 8 MB");
  const { admin, supabase } = await authorized();
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  const path = `${new Date().getUTCFullYear()}/${crypto.randomUUID()}-${safeName || "image"}`;
  const { error: uploadError } = await supabase.storage.from("project-media").upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) throw new Error("Unable to upload image");
  const { data: publicData } = supabase.storage.from("project-media").getPublicUrl(path);
  const { error } = await supabase.from("media_assets").insert({ storage_path: path, public_url: publicData.publicUrl, file_name: file.name, mime_type: file.type, size_bytes: file.size, alt_text: alt, uploaded_by: admin.user.id });
  if (error) { await supabase.storage.from("project-media").remove([path]); throw new Error("Unable to save media metadata"); }
  revalidatePath("/admin/media");
}

export async function deleteMedia(formData: FormData) {
  const parsed = z.object({ id: z.string().uuid(), path: z.string().min(1).max(1000) }).parse({ id: formData.get("id"), path: formData.get("path") });
  const { supabase } = await authorized();
  const [{ count: projectUse }, { count: serviceUse }, { count: galleryUse }] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("hero_image_path", parsed.path),
    supabase.from("services").select("id", { count: "exact", head: true }).eq("image_path", parsed.path),
    supabase.from("project_images").select("id", { count: "exact", head: true }).eq("storage_path", parsed.path),
  ]);
  if ((projectUse || 0) + (serviceUse || 0) + (galleryUse || 0) > 0) throw new Error("This image is still in use");
  const { error: storageError } = await supabase.storage.from("project-media").remove([parsed.path]);
  if (storageError) throw new Error("Unable to delete image");
  await supabase.from("media_assets").delete().eq("id", parsed.id); revalidatePath("/admin/media");
}
