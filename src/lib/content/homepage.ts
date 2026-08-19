export interface CmsImage {
  url: string;
  path: string;
  alt: string;
  width: number | null;
  height: number | null;
}

export interface HomepageHero {
  eyebrow: string;
  heading: string;
  description: string;
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText: string;
  secondaryCtaUrl: string;
  secondaryCtaEnabled: boolean;
  overlay: number;
  alignment: "left" | "center";
  layout: "standard" | "split" | "minimal";
  image: CmsImage | null;
  mobileImage: CmsImage | null;
}

export interface HomepageAbout {
  visible: boolean;
  label: string;
  heading: string;
  description: string;
  secondaryDescription: string;
  ctaText: string;
  ctaUrl: string;
  image: CmsImage | null;
  secondaryImage: CmsImage | null;
}

export interface HomepageStats {
  visible: boolean;
  items: Array<{ value: string; label: string }>;
}

export interface HomepageCollectionSection {
  visible: boolean;
  eyebrow: string;
  heading: string;
  subheading: string;
  layout: "list" | "cards" | "editorial" | "grid";
}

export interface HomepageTestimonials {
  visible: boolean;
  eyebrow: string;
  heading: string;
}

export interface HomepageCta {
  visible: boolean;
  eyebrow: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  image: CmsImage | null;
}

export interface HomepageSeo {
  title: string;
  description: string;
  canonical: string;
  ogImage: CmsImage | null;
}

export interface HomepageContent {
  hero: HomepageHero;
  about: HomepageAbout;
  stats: HomepageStats;
  services: HomepageCollectionSection;
  projects: HomepageCollectionSection;
  testimonials: HomepageTestimonials;
  cta: HomepageCta;
  seo: HomepageSeo;
}

const fallbackHeroUrl = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=88";

export const homepageDefaults: HomepageContent = {
  hero: {
    eyebrow: "New York · Building Nationwide",
    heading: "We Build What's Next.",
    description: "Building exceptional spaces through precision, craftsmanship and purpose.",
    primaryCtaText: "Explore Our Work",
    primaryCtaUrl: "/projects",
    secondaryCtaText: "Start a Project",
    secondaryCtaUrl: "/request-a-quote",
    secondaryCtaEnabled: true,
    overlay: 46,
    alignment: "left",
    layout: "standard",
    image: { url: fallbackHeroUrl, path: "", alt: "Modern high-rise architecture rising into a clear sky", width: 2400, height: 1600 },
    mobileImage: null,
  },
  about: {
    visible: true,
    label: "01 / About Northline",
    heading: "Built on precision. Driven by possibility.",
    description: "Northline builds places where people work, live, heal, gather, and move forward. For more than 25 years, we have brought discipline to demanding projects across the United States—aligning design intent with real-world execution from the earliest decision through final handover.",
    secondaryDescription: "Our teams pair construction knowledge with direct communication and an exacting standard of craft. The result is work that performs under pressure and holds its value over time.",
    ctaText: "",
    ctaUrl: "/about",
    image: null,
    secondaryImage: null,
  },
  stats: {
    visible: true,
    items: [
      { value: "25+", label: "Years of Experience" },
      { value: "180+", label: "Projects Delivered" },
      { value: "$1.2B+", label: "Project Value" },
      { value: "14", label: "Industry Awards" },
    ],
  },
  services: { visible: true, eyebrow: "03 / What We Do", heading: "Expertise", subheading: "", layout: "list" },
  projects: { visible: true, eyebrow: "02 / Featured Projects", heading: "Selected Work", subheading: "", layout: "editorial" },
  testimonials: { visible: true, eyebrow: "07 / Client Perspective", heading: "What our clients say" },
  cta: { visible: true, eyebrow: "Have a project in mind?", heading: "Let's build something remarkable.", description: "", buttonText: "Start a Project", buttonUrl: "/request-a-quote", image: null },
  seo: { title: "Northline Construction & Development | Building What's Next", description: "Building exceptional spaces through precision, craftsmanship, and uncompromising standards.", canonical: "/", ogImage: null },
};

const record = (value: unknown): Record<string, unknown> => value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const string = (value: unknown, fallback: string) => typeof value === "string" ? value : fallback;
const bool = (value: unknown, fallback: boolean) => typeof value === "boolean" ? value : fallback;
const number = (value: unknown, fallback: number) => typeof value === "number" && Number.isFinite(value) ? value : fallback;

export function parseCmsImage(value: unknown, fallback: CmsImage | null = null): CmsImage | null {
  const item = record(value);
  const url = string(item.url, "");
  if (!url) return fallback;
  return {
    url,
    path: string(item.path, ""),
    alt: string(item.alt, ""),
    width: typeof item.width === "number" ? item.width : null,
    height: typeof item.height === "number" ? item.height : null,
  };
}

export function parseHomepageContent(content: Record<string, unknown>): HomepageContent {
  const hero = record(content["home.hero"]);
  const about = record(content["home.about"]);
  const stats = record(content["home.stats"]);
  const services = record(content["home.services"]);
  const projects = record(content["home.projects"]);
  const testimonials = record(content["home.testimonials"]);
  const cta = record(content["home.cta"]);
  const seo = record(content["home.seo"]);
  const alignment = hero.alignment === "center" ? "center" : "left";
  const heroLayout = ["standard", "split", "minimal"].includes(String(hero.layout)) ? hero.layout as HomepageHero["layout"] : homepageDefaults.hero.layout;
  const serviceLayout = services.layout === "cards" ? "cards" : "list";
  const projectLayout = projects.layout === "grid" ? "grid" : "editorial";
  const statItems = Array.isArray(stats.items) ? stats.items.slice(0, 6).map(record).map((item) => ({ value: string(item.value, ""), label: string(item.label, "") })).filter((item) => item.value && item.label) : [];
  return {
    hero: {
      eyebrow: string(hero.eyebrow, homepageDefaults.hero.eyebrow),
      heading: string(hero.heading, homepageDefaults.hero.heading),
      description: string(hero.description, homepageDefaults.hero.description),
      primaryCtaText: string(hero.primaryCtaText, homepageDefaults.hero.primaryCtaText),
      primaryCtaUrl: string(hero.primaryCtaUrl, homepageDefaults.hero.primaryCtaUrl),
      secondaryCtaText: string(hero.secondaryCtaText ?? hero.cta, homepageDefaults.hero.secondaryCtaText),
      secondaryCtaUrl: string(hero.secondaryCtaUrl, homepageDefaults.hero.secondaryCtaUrl),
      secondaryCtaEnabled: bool(hero.secondaryCtaEnabled, homepageDefaults.hero.secondaryCtaEnabled),
      overlay: Math.min(80, Math.max(10, number(hero.overlay, homepageDefaults.hero.overlay))),
      alignment,
      layout: heroLayout,
      image: parseCmsImage(hero.image, homepageDefaults.hero.image),
      mobileImage: parseCmsImage(hero.mobileImage),
    },
    about: {
      visible: bool(about.visible, true),
      label: string(about.label, homepageDefaults.about.label),
      heading: string(about.heading, homepageDefaults.about.heading),
      description: string(about.description ?? about.body, homepageDefaults.about.description),
      secondaryDescription: string(about.secondaryDescription, homepageDefaults.about.secondaryDescription),
      ctaText: string(about.ctaText, ""),
      ctaUrl: string(about.ctaUrl, "/about"),
      image: parseCmsImage(about.image),
      secondaryImage: parseCmsImage(about.secondaryImage),
    },
    stats: { visible: bool(stats.visible, true), items: statItems.length ? statItems : homepageDefaults.stats.items },
    services: { visible: bool(services.visible, true), eyebrow: string(services.eyebrow, homepageDefaults.services.eyebrow), heading: string(services.heading, homepageDefaults.services.heading), subheading: string(services.subheading, ""), layout: serviceLayout },
    projects: { visible: bool(projects.visible, true), eyebrow: string(projects.eyebrow, homepageDefaults.projects.eyebrow), heading: string(projects.heading, homepageDefaults.projects.heading), subheading: string(projects.subheading, ""), layout: projectLayout },
    testimonials: { visible: bool(testimonials.visible, true), eyebrow: string(testimonials.eyebrow, homepageDefaults.testimonials.eyebrow), heading: string(testimonials.heading, homepageDefaults.testimonials.heading) },
    cta: { visible: bool(cta.visible, true), eyebrow: string(cta.eyebrow, homepageDefaults.cta.eyebrow), heading: string(cta.heading, homepageDefaults.cta.heading), description: string(cta.description, ""), buttonText: string(cta.buttonText, homepageDefaults.cta.buttonText), buttonUrl: string(cta.buttonUrl, homepageDefaults.cta.buttonUrl), image: parseCmsImage(cta.image) },
    seo: { title: string(seo.title, homepageDefaults.seo.title), description: string(seo.description, homepageDefaults.seo.description), canonical: string(seo.canonical, "/"), ogImage: parseCmsImage(seo.ogImage) },
  };
}
