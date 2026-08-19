"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { projects as starterProjects } from "@/data/projects";
import { services as starterServices } from "@/data/services";
import { requireAdmin } from "@/lib/admin/auth";
import { projectSchema, serviceSchema } from "@/lib/admin/schemas";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { CmsImage } from "@/lib/content/homepage";

async function authorized() {
  const admin = await requireAdmin();
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured");
  return { admin, supabase };
}

const lines = (value: string) => value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
const checkbox = (form: FormData, name: string) => form.get(name) === "on";
const safeUrl = z.string().trim().max(2000).refine((value) => !value || value.startsWith("/") || /^https:\/\//i.test(value), "Use a relative path or HTTPS URL");
const optionalUuid = z.string().uuid().or(z.literal("")).transform((value) => value || null);
const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];

async function resolveMedia(formData: FormData, name: string, folder: string, adminId: string, supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>): Promise<CmsImage | null> {
  if (!supabase) throw new Error("Supabase is not configured");
  const file = formData.get(`${name}File`);
  const alt = String(formData.get(`${name}Alt`) || "").trim().slice(0, 300);
  if (file instanceof File && file.size > 0) {
    if (!imageTypes.includes(file.type) || file.size > 8 * 1024 * 1024) throw new Error("Use a JPG, PNG, WebP, or AVIF image up to 8 MB");
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "image";
    const path = `${folder}/${crypto.randomUUID()}-${safeName}`;
    const { error: uploadError } = await supabase.storage.from("project-media").upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) throw new Error(`Unable to upload ${name} image`);
    const { data } = supabase.storage.from("project-media").getPublicUrl(path);
    const width = Number(formData.get(`${name}Width`)) || null;
    const height = Number(formData.get(`${name}Height`)) || null;
    const { error: metadataError } = await supabase.from("media_assets").insert({ bucket: "project-media", storage_path: path, public_url: data.publicUrl, file_name: file.name, mime_type: file.type, size_bytes: file.size, width, height, alt_text: alt, uploaded_by: adminId });
    if (metadataError) { await supabase.storage.from("project-media").remove([path]); throw new Error("Unable to save uploaded image metadata"); }
    return { url: data.publicUrl, path, alt, width, height };
  }
  if (formData.get(`${name}Remove`) === "1") return null;
  const url = String(formData.get(`${name}Url`) || "").trim();
  if (!url) return null;
  safeUrl.parse(url);
  return { url, path: String(formData.get(`${name}Path`) || "").trim(), alt, width: Number(formData.get(`${name}Width`)) || null, height: Number(formData.get(`${name}Height`)) || null };
}

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
    projectSize: formData.get("projectSize") || "", projectValue:formData.get("projectValue")||"",deliveryMethod: formData.get("deliveryMethod") || "", services: formData.get("services") || "",
    gallery: formData.get("gallery") || "", metrics: formData.get("metrics") || "", seoTitle: formData.get("seoTitle") || "",
    seoDescription: formData.get("seoDescription") || "",canonicalUrl:formData.get("canonicalUrl")||"", status: formData.get("status"), featured: checkbox(formData, "featured"), sortOrder: formData.get("sortOrder") || 0,
  });
  const { admin, supabase } = await authorized();
  const [heroImage,ogImage]=await Promise.all([resolveMedia(formData,"projectHero","site/projects",admin.user.id,supabase),resolveMedia(formData,"projectOg","site/seo",admin.user.id,supabase)]);
  const metricRows = lines(parsed.metrics).map((row) => { const [value, ...label] = row.split("|"); return { value: value.trim(), label: label.join("|").trim() }; }).filter((item) => item.value && item.label);
  const payload = { slug: parsed.slug, title: parsed.title, summary: parsed.summary, description: parsed.description, story: lines(parsed.story), challenge: parsed.challenge, approach: parsed.approach, outcome: parsed.outcome,
    client_name: parsed.clientName, location: parsed.location, category: parsed.category, completion_year: parsed.completionYear, project_size: parsed.projectSize,project_value:parsed.projectValue, delivery_method: parsed.deliveryMethod,
    services: lines(parsed.services), hero_image_path:heroImage?.path||null,hero_image_url:heroImage?.url||null,hero_image_alt:heroImage?.alt||null,hero_image_width:heroImage?.width||null,hero_image_height:heroImage?.height||null, metrics: metricRows, seo_title: parsed.seoTitle, seo_description: parsed.seoDescription,og_image_path:ogImage?.path||null,og_image_url:ogImage?.url||null,canonical_url:parsed.canonicalUrl,
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
  const gallery = lines(parsed.gallery).map((row, index) => { const [url,alt,path] = row.split("|"); return { project_id: projectId!, public_url: url.trim(), alt_text:(alt||"").trim(),storage_path:(path||"").trim()||null, sort_order: index }; }).filter((item) => item.public_url);
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
    description: formData.get("description") || "", capabilities: formData.get("capabilities") || "", relatedProjects: formData.get("relatedProjects") || "",icon:formData.get("icon")||"",
    seoTitle: formData.get("seoTitle") || "", seoDescription: formData.get("seoDescription") || "",canonicalUrl:formData.get("canonicalUrl")||"", active: checkbox(formData, "active"), featured: checkbox(formData, "featured"), sortOrder: formData.get("sortOrder") || 0 });
  const { admin, supabase } = await authorized();
  const [serviceImage,ogImage]=await Promise.all([resolveMedia(formData,"serviceImage","site/services",admin.user.id,supabase),resolveMedia(formData,"serviceOg","site/seo",admin.user.id,supabase)]);
  const payload = { slug: parsed.slug, title: parsed.title, number: parsed.number, summary: parsed.summary, description: parsed.description, capabilities: lines(parsed.capabilities), related_project_slugs: lines(parsed.relatedProjects),
    image_path:serviceImage?.path||null,image_url:serviceImage?.url||null,image_alt:serviceImage?.alt||null,image_width:serviceImage?.width||null,image_height:serviceImage?.height||null,icon:parsed.icon, seo_title: parsed.seoTitle, seo_description: parsed.seoDescription,og_image_path:ogImage?.path||null,og_image_url:ogImage?.url||null,canonical_url:parsed.canonicalUrl, active: parsed.active, featured: parsed.featured, sort_order: parsed.sortOrder, updated_by: admin.user.id };
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
  const folder = z.enum(["site/homepage","site/services","site/projects","site/testimonials","site/seo"]).catch("site/homepage").parse(formData.get("folder"));
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  const path = `${folder}/${crypto.randomUUID()}-${safeName || "image"}`;
  const { error: uploadError } = await supabase.storage.from("project-media").upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) throw new Error("Unable to upload image");
  const { data: publicData } = supabase.storage.from("project-media").getPublicUrl(path);
  const width = Number(formData.get("width")) || null; const height = Number(formData.get("height")) || null;
  const { error } = await supabase.from("media_assets").insert({ storage_path: path, public_url: publicData.publicUrl, file_name: file.name, mime_type: file.type, size_bytes: file.size, width, height, alt_text: alt, uploaded_by: admin.user.id });
  if (error) { await supabase.storage.from("project-media").remove([path]); throw new Error("Unable to save media metadata"); }
  revalidatePath("/admin/media");
}

export async function deleteMedia(formData: FormData) {
  const parsed = z.object({ id: z.string().uuid(), path: z.string().min(1).max(1000) }).parse({ id: formData.get("id"), path: formData.get("path") });
  const { supabase } = await authorized();
  const asset = await supabase.from("media_assets").select("public_url").eq("id", parsed.id).maybeSingle();
  const [projects, services, galleries, testimonials, content, settings] = await Promise.all([
    supabase.from("projects").select("hero_image_path,hero_image_url,og_image_path,og_image_url"),
    supabase.from("services").select("image_path,image_url,og_image_path,og_image_url"),
    supabase.from("project_images").select("storage_path,public_url"),
    supabase.from("testimonials").select("avatar_path,avatar_url"),
    supabase.from("site_content").select("value"),
    supabase.from("site_settings").select("value"),
  ]);
  const searchable = JSON.stringify([projects.data || [], services.data || [], galleries.data || [], testimonials.data || [], content.data || [], settings.data || []]);
  if (searchable.includes(parsed.path) || (asset.data?.public_url && searchable.includes(asset.data.public_url))) throw new Error("This image is still in use. Replace it in the CMS before deleting it.");
  const { error: storageError } = await supabase.storage.from("project-media").remove([parsed.path]);
  if (storageError) throw new Error("Unable to delete image");
  await supabase.from("media_assets").delete().eq("id", parsed.id); revalidatePath("/admin/media");
}

export type CmsActionState = { status: "idle" | "success" | "error"; message: string };

export async function saveHomepageContent(_previous: CmsActionState, formData: FormData): Promise<CmsActionState> {
  try {
    const text = (name: string) => String(formData.get(name) || "").trim();
    const parsed = z.object({
      heroEyebrow: z.string().max(60), heroHeading: z.string().min(3).max(90), heroDescription: z.string().min(10).max(240),
      heroPrimaryText: z.string().min(1).max(36), heroPrimaryUrl: safeUrl, heroSecondaryText: z.string().max(36), heroSecondaryUrl: safeUrl,
      heroOverlay: z.coerce.number().int().min(10).max(80), heroAlignment: z.enum(["left","center"]), heroLayout: z.enum(["standard","split","minimal"]),
      aboutLabel: z.string().max(60), aboutHeading: z.string().min(3).max(140), aboutDescription: z.string().min(20).max(700), aboutSecondaryDescription: z.string().max(500), aboutCtaText: z.string().max(36), aboutCtaUrl: safeUrl,
      servicesEyebrow: z.string().max(60), servicesHeading: z.string().min(2).max(80), servicesSubheading: z.string().max(180), servicesLayout: z.enum(["list","cards"]),
      projectsEyebrow: z.string().max(60), projectsHeading: z.string().min(2).max(80), projectsSubheading: z.string().max(180), projectsLayout: z.enum(["editorial","grid"]),
      testimonialsEyebrow: z.string().max(60), testimonialsHeading: z.string().min(2).max(100),
      ctaEyebrow: z.string().max(60), ctaHeading: z.string().min(3).max(110), ctaDescription: z.string().max(240), ctaButtonText: z.string().min(1).max(36), ctaButtonUrl: safeUrl,
      seoTitle: z.string().min(10).max(70), seoDescription: z.string().min(30).max(180), seoCanonical: safeUrl,
    }).parse({
      heroEyebrow:text("heroEyebrow"),heroHeading:text("heroHeading"),heroDescription:text("heroDescription"),heroPrimaryText:text("heroPrimaryText"),heroPrimaryUrl:text("heroPrimaryUrl"),heroSecondaryText:text("heroSecondaryText"),heroSecondaryUrl:text("heroSecondaryUrl"),heroOverlay:text("heroOverlay"),heroAlignment:text("heroAlignment"),heroLayout:text("heroLayout"),
      aboutLabel:text("aboutLabel"),aboutHeading:text("aboutHeading"),aboutDescription:text("aboutDescription"),aboutSecondaryDescription:text("aboutSecondaryDescription"),aboutCtaText:text("aboutCtaText"),aboutCtaUrl:text("aboutCtaUrl"),
      servicesEyebrow:text("servicesEyebrow"),servicesHeading:text("servicesHeading"),servicesSubheading:text("servicesSubheading"),servicesLayout:text("servicesLayout"),
      projectsEyebrow:text("projectsEyebrow"),projectsHeading:text("projectsHeading"),projectsSubheading:text("projectsSubheading"),projectsLayout:text("projectsLayout"),
      testimonialsEyebrow:text("testimonialsEyebrow"),testimonialsHeading:text("testimonialsHeading"),ctaEyebrow:text("ctaEyebrow"),ctaHeading:text("ctaHeading"),ctaDescription:text("ctaDescription"),ctaButtonText:text("ctaButtonText"),ctaButtonUrl:text("ctaButtonUrl"),
      seoTitle:text("seoTitle"),seoDescription:text("seoDescription"),seoCanonical:text("seoCanonical"),
    });
    const stats = formData.getAll("statValue").map(String).map((value, index) => ({ value: value.trim(), label: String(formData.getAll("statLabel")[index] || "").trim() })).filter((item) => item.value || item.label);
    z.array(z.object({ value: z.string().min(1).max(16), label: z.string().min(2).max(60) })).min(1).max(6).parse(stats);
    const featuredProjects = z.array(z.string().uuid()).max(5).parse(formData.getAll("featuredProjects"));
    const featuredServices = z.array(z.string().uuid()).max(6).parse(formData.getAll("featuredServices"));
    const { admin, supabase } = await authorized();
    const [heroImage, heroMobileImage, aboutImage, aboutSecondaryImage, ctaImage, seoImage] = await Promise.all([
      resolveMedia(formData,"heroImage","site/homepage",admin.user.id,supabase), resolveMedia(formData,"heroMobileImage","site/homepage",admin.user.id,supabase),
      resolveMedia(formData,"aboutImage","site/homepage",admin.user.id,supabase), resolveMedia(formData,"aboutSecondaryImage","site/homepage",admin.user.id,supabase),
      resolveMedia(formData,"ctaImage","site/homepage",admin.user.id,supabase), resolveMedia(formData,"seoImage","site/seo",admin.user.id,supabase),
    ]);
    const rows = [
      { key:"home.hero",section:"Homepage",label:"Hero",value:{eyebrow:parsed.heroEyebrow,heading:parsed.heroHeading,description:parsed.heroDescription,primaryCtaText:parsed.heroPrimaryText,primaryCtaUrl:parsed.heroPrimaryUrl,secondaryCtaText:parsed.heroSecondaryText,secondaryCtaUrl:parsed.heroSecondaryUrl,secondaryCtaEnabled:checkbox(formData,"heroSecondaryEnabled"),overlay:parsed.heroOverlay,alignment:parsed.heroAlignment,layout:parsed.heroLayout,image:heroImage,mobileImage:heroMobileImage},updated_by:admin.user.id },
      { key:"home.about",section:"Homepage",label:"About",value:{visible:checkbox(formData,"aboutVisible"),label:parsed.aboutLabel,heading:parsed.aboutHeading,description:parsed.aboutDescription,secondaryDescription:parsed.aboutSecondaryDescription,ctaText:parsed.aboutCtaText,ctaUrl:parsed.aboutCtaUrl,image:aboutImage,secondaryImage:aboutSecondaryImage},updated_by:admin.user.id },
      { key:"home.stats",section:"Homepage",label:"Company statistics",value:{visible:checkbox(formData,"statsVisible"),items:stats},updated_by:admin.user.id },
      { key:"home.services",section:"Homepage",label:"Services",value:{visible:checkbox(formData,"servicesVisible"),eyebrow:parsed.servicesEyebrow,heading:parsed.servicesHeading,subheading:parsed.servicesSubheading,layout:parsed.servicesLayout},updated_by:admin.user.id },
      { key:"home.projects",section:"Homepage",label:"Featured projects",value:{visible:checkbox(formData,"projectsVisible"),eyebrow:parsed.projectsEyebrow,heading:parsed.projectsHeading,subheading:parsed.projectsSubheading,layout:parsed.projectsLayout},updated_by:admin.user.id },
      { key:"home.testimonials",section:"Homepage",label:"Testimonials",value:{visible:checkbox(formData,"testimonialsVisible"),eyebrow:parsed.testimonialsEyebrow,heading:parsed.testimonialsHeading},updated_by:admin.user.id },
      { key:"home.cta",section:"Homepage",label:"Call to action",value:{visible:checkbox(formData,"ctaVisible"),eyebrow:parsed.ctaEyebrow,heading:parsed.ctaHeading,description:parsed.ctaDescription,buttonText:parsed.ctaButtonText,buttonUrl:parsed.ctaButtonUrl,image:ctaImage},updated_by:admin.user.id },
      { key:"home.seo",section:"Homepage",label:"Homepage SEO",value:{title:parsed.seoTitle,description:parsed.seoDescription,canonical:parsed.seoCanonical,ogImage:seoImage},updated_by:admin.user.id },
    ];
    const { error } = await supabase.from("site_content").upsert(rows,{onConflict:"key"});
    if (error) throw error;
    const projectReset = await supabase.from("projects").update({featured:false,updated_by:admin.user.id}).neq("status","archived");
    const serviceReset = await supabase.from("services").update({featured:false,updated_by:admin.user.id}).not("id","is",null);
    if (projectReset.error || serviceReset.error) throw projectReset.error || serviceReset.error;
    for (const [index,id] of featuredProjects.entries()) { const result=await supabase.from("projects").update({featured:true,sort_order:index,updated_by:admin.user.id}).eq("id",id); if(result.error) throw result.error; }
    for (const [index,id] of featuredServices.entries()) { const result=await supabase.from("services").update({featured:true,sort_order:index,updated_by:admin.user.id}).eq("id",id); if(result.error) throw result.error; }
    revalidatePath("/"); revalidatePath("/projects"); revalidatePath("/services"); revalidatePath("/admin/content/homepage");
    return { status:"success",message:"Homepage published successfully." };
  } catch (error) {
    const message = error instanceof z.ZodError ? error.issues[0]?.message : error instanceof Error ? error.message : "Unable to publish homepage";
    return { status:"error",message:message || "Unable to publish homepage" };
  }
}

export async function saveTestimonial(formData: FormData) {
  const parsed = z.object({ id:z.string().uuid().optional(),clientName:z.string().trim().min(2).max(120),company:z.string().trim().max(160),jobTitle:z.string().trim().max(160),quote:z.string().trim().min(20).max(800),projectId:optionalUuid,sortOrder:z.coerce.number().int().min(-1000).max(1000) }).parse({ id:formData.get("id")||undefined,clientName:formData.get("clientName"),company:formData.get("company")||"",jobTitle:formData.get("jobTitle")||"",quote:formData.get("quote"),projectId:formData.get("projectId")||"",sortOrder:formData.get("sortOrder")||0 });
  const { admin, supabase } = await authorized();
  const avatar = await resolveMedia(formData,"avatar","site/testimonials",admin.user.id,supabase);
  const payload={client_name:parsed.clientName,company:parsed.company||null,job_title:parsed.jobTitle||null,quote:parsed.quote,project_id:parsed.projectId,sort_order:parsed.sortOrder,featured:checkbox(formData,"featured"),published:checkbox(formData,"published"),avatar_path:avatar?.path||null,avatar_url:avatar?.url||null,avatar_alt:avatar?.alt||null,updated_by:admin.user.id};
  let id=parsed.id;
  if(id){const {error}=await supabase.from("testimonials").update(payload).eq("id",id);if(error)throw new Error("Unable to update testimonial");}
  else{const {data,error}=await supabase.from("testimonials").insert({...payload,created_by:admin.user.id}).select("id").single();if(error||!data)throw new Error("Unable to create testimonial");id=data.id;}
  revalidatePath("/");revalidatePath("/admin/content/testimonials");redirect(`/admin/content/testimonials/${id}?saved=1`);
}

export async function deleteTestimonial(formData: FormData) {
  const id=z.string().uuid().parse(formData.get("id"));const {supabase}=await authorized();const {error}=await supabase.from("testimonials").delete().eq("id",id);if(error)throw new Error("Unable to delete testimonial");revalidatePath("/");revalidatePath("/admin/content/testimonials");redirect("/admin/content/testimonials");
}

export async function saveBusinessSettings(_previous: CmsActionState, formData: FormData): Promise<CmsActionState> {
  try {
    const get=(key:string)=>String(formData.get(key)||"").trim();
    const business=z.object({name:z.string().min(2).max(120),email:z.string().email().max(254),phone:z.string().min(5).max(40),address:z.string().max(240),hours:z.string().max(160),contactCta:z.string().max(36)}).parse({name:get("name"),email:get("email"),phone:get("phone"),address:get("address"),hours:get("hours"),contactCta:get("contactCta")});
    const social=z.object({linkedin:safeUrl,instagram:safeUrl}).parse({linkedin:get("linkedin"),instagram:get("instagram")});
    const footer=z.object({description:z.string().max(240),copyright:z.string().max(160),contactCta:z.string().max(36)}).parse({description:get("footerDescription"),copyright:get("copyright"),contactCta:business.contactCta});
    const {admin,supabase}=await authorized();const {error}=await supabase.from("site_settings").upsert([{key:"business",label:"Business information",value:business,is_public:true,updated_by:admin.user.id},{key:"social",label:"Social links",value:social,is_public:true,updated_by:admin.user.id},{key:"footer",label:"Footer",value:footer,is_public:true,updated_by:admin.user.id}],{onConflict:"key"});if(error)throw error;
    revalidatePath("/", "layout");revalidatePath("/admin/settings");return{status:"success",message:"Business and footer settings saved."};
  }catch(error){return{status:"error",message:error instanceof z.ZodError?error.issues[0]?.message:error instanceof Error?error.message:"Unable to save settings"};}
}

export async function saveSeoSettings(_previous: CmsActionState, formData: FormData): Promise<CmsActionState> {
  try {
    const get=(key:string)=>String(formData.get(key)||"").trim();
    const schema=z.object({title:z.string().min(10).max(70),description:z.string().min(30).max(180),siteName:z.string().min(2).max(120),canonical:safeUrl});
    const global=schema.parse({title:get("globalTitle"),description:get("globalDescription"),siteName:get("siteName"),canonical:"/"});
    const projects=schema.omit({siteName:true}).parse({title:get("projectsTitle"),description:get("projectsDescription"),canonical:get("projectsCanonical")});
    const services=schema.omit({siteName:true}).parse({title:get("servicesTitle"),description:get("servicesDescription"),canonical:get("servicesCanonical")});
    const {admin,supabase}=await authorized();const [globalImage,projectsImage,servicesImage]=await Promise.all([resolveMedia(formData,"globalOg","site/seo",admin.user.id,supabase),resolveMedia(formData,"projectsOg","site/seo",admin.user.id,supabase),resolveMedia(formData,"servicesOg","site/seo",admin.user.id,supabase)]);
    const {error}=await supabase.from("site_settings").upsert([{key:"seo",label:"Default SEO",value:{...global,ogImage:globalImage},is_public:true,updated_by:admin.user.id},{key:"seo.projects",label:"Projects SEO",value:{...projects,ogImage:projectsImage},is_public:true,updated_by:admin.user.id},{key:"seo.services",label:"Services SEO",value:{...services,ogImage:servicesImage},is_public:true,updated_by:admin.user.id}],{onConflict:"key"});if(error)throw error;
    revalidatePath("/", "layout");revalidatePath("/projects");revalidatePath("/services");revalidatePath("/admin/settings/seo");return{status:"success",message:"SEO settings published."};
  }catch(error){return{status:"error",message:error instanceof z.ZodError?error.issues[0]?.message:error instanceof Error?error.message:"Unable to save SEO settings"};}
}
