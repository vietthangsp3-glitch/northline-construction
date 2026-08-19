import { Expertise } from "@/components/sections/home/expertise";
import { FinalCta } from "@/components/sections/home/final-cta";
import { HeroIntro } from "@/components/sections/home/hero-intro";
import { People } from "@/components/sections/home/people";
import { PrinciplesProcess } from "@/components/sections/home/principles-process";
import { ProjectBreak } from "@/components/sections/home/project-break";
import { SelectedWork } from "@/components/sections/home/selected-work";
import { TestimonialInsights } from "@/components/sections/home/testimonial-insights";
import { getHomepageContent } from "@/lib/content/public";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomepageContent();
  const image = seo.ogImage;
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonical || "/" },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonical || "/",
      images: image ? [{ url: image.url, width: image.width || 1200, height: image.height || 630, alt: image.alt }] : undefined,
    },
  };
}

export default async function HomePage() {
  const homepage = await getHomepageContent();
  return (
    <main id="main-content">
      <HeroIntro content={homepage} />
      {homepage.projects.visible && <SelectedWork config={homepage.projects} />}
      {homepage.services.visible && <Expertise config={homepage.services} />}
      <PrinciplesProcess />
      {homepage.projects.visible && <ProjectBreak />}
      <People />
      <TestimonialInsights config={homepage.testimonials} />
      {homepage.cta.visible && <FinalCta config={homepage.cta} />}
    </main>
  );
}
