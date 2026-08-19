import { z } from "zod";

const slug = z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens.");
const optionalText = (max: number) => z.string().trim().max(max).transform((value) => value || null);

export const projectSchema = z.object({
  id: z.string().uuid().optional(), slug, title: z.string().trim().min(2).max(140), summary: z.string().trim().min(20).max(400),
  description: z.string().trim().max(10000), story: z.string().max(15000), challenge: z.string().max(5000), approach: z.string().max(5000), outcome: z.string().max(5000),
  clientName: optionalText(160), location: z.string().trim().max(160), category: z.string().trim().min(2).max(80), completionYear: z.coerce.number().int().min(1900).max(2200).nullable(),
  projectSize: optionalText(100), projectValue: optionalText(100), deliveryMethod: optionalText(120), services: z.string().max(3000),
  gallery: z.string().max(20000), metrics: z.string().max(5000), seoTitle: optionalText(70), seoDescription: optionalText(180), canonicalUrl: optionalText(2000), status: z.enum(["draft","published","archived"]),
  featured: z.boolean(), sortOrder: z.coerce.number().int().min(-1000).max(1000),
});

export const serviceSchema = z.object({
  id: z.string().uuid().optional(), slug, title: z.string().trim().min(2).max(140), number: z.string().trim().min(1).max(8), summary: z.string().trim().min(20).max(400),
  description: z.string().trim().max(10000), capabilities: z.string().max(5000), relatedProjects: z.string().max(3000), icon: optionalText(80),
  seoTitle: optionalText(70), seoDescription: optionalText(180), canonicalUrl: optionalText(2000), active: z.boolean(), featured: z.boolean(), sortOrder: z.coerce.number().int().min(-1000).max(1000),
});
