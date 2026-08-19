import type { MetadataRoute } from "next";
import { insights } from "@/data/insights";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-18T00:00:00.000Z");
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/about"), lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/team"), lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/projects"), lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/services"), lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/insights"), lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/contact"), lastModified, changeFrequency: "yearly", priority: 0.7 },
    { url: absoluteUrl("/request-a-quote"), lastModified, changeFrequency: "yearly", priority: 0.8 },
    { url: absoluteUrl("/privacy"), lastModified, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];
  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: absoluteUrl("/projects/" + project.slug),
    lastModified,
    changeFrequency: "yearly",
    priority: 0.8,
    images: [project.cover.src],
  }));
  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: absoluteUrl("/services/" + service.slug),
    lastModified,
    changeFrequency: "yearly",
    priority: 0.7,
  }));
  const insightRoutes: MetadataRoute.Sitemap = insights.map((insight) => ({
    url: absoluteUrl("/insights/" + insight.slug),
    lastModified: new Date(insight.publishedAt + "T00:00:00.000Z"),
    changeFrequency: "yearly",
    priority: 0.6,
    images: [insight.image.src],
  }));
  return [...staticRoutes, ...projectRoutes, ...serviceRoutes, ...insightRoutes];
}
