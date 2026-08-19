export const projectCategories = [
  "Commercial",
  "Residential",
  "Hospitality",
  "Healthcare",
  "Corporate",
] as const;

export type ProjectCategory = (typeof projectCategories)[number];

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ProjectMetric {
  value: string;
  label: string;
}

export interface Project {
  slug: string;
  name: string;
  location: string;
  category: ProjectCategory;
  year: number;
  size: string;
  delivery: string;
  client: string;
  summary: string;
  story: string[];
  challenge: string;
  approach: string;
  outcome: string;
  cover: ImageAsset;
  gallery: ImageAsset[];
  metrics: ProjectMetric[];
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: ImageAsset;
  canonicalUrl?: string;
}

export interface Service {
  slug: string;
  name: string;
  number: string;
  summary: string;
  introduction: string;
  capabilities: string[];
  relatedProjectSlugs: string[];
  image: ImageAsset;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: ImageAsset;
  canonicalUrl?: string;
  featured?: boolean;
}

export interface TeamMember {
  name: string;
  role: string;
  expertise: string;
  biography: string;
  portrait: ImageAsset;
}

export interface Insight {
  slug: string;
  title: string;
  excerpt: string;
  category: "Perspective" | "Process" | "Sustainability" | "Company News";
  publishedAt: string;
  readingTime: string;
  image: ImageAsset;
  content: string[];
}

export interface Testimonial {
  id?: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: ImageAsset;
  projectSlug?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
}
