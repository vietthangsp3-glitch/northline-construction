import { ProjectFilter } from "@/components/projects/project-filter";
import { Container } from "@/components/ui/container";
import { getPublicProjects } from "@/lib/content/public";
import { createPageMetadata } from "@/lib/site";
import { getPublicSettings } from "@/lib/content/public";
import type { Metadata } from "next";

export const revalidate=60;
export async function generateMetadata():Promise<Metadata>{const settings=await getPublicSettings();const seo=(settings["seo.projects"]||{}) as {title?:string;description?:string;canonical?:string;ogImage?:{url?:string;alt?:string;width?:number;height?:number}};const fallback=createPageMetadata({title:"Projects",description:"Explore Northline's commercial, residential, hospitality, healthcare, and corporate construction portfolio.",path:"/projects"});if(!seo.title)return fallback;return{title:seo.title,description:seo.description,alternates:{canonical:seo.canonical||"/projects"},openGraph:{title:seo.title,description:seo.description,url:seo.canonical||"/projects",images:seo.ogImage?.url?[{url:seo.ogImage.url,width:seo.ogImage.width||1200,height:seo.ogImage.height||630,alt:seo.ogImage.alt||seo.title}]:undefined}}}

export default async function ProjectsPage() {
  const projects = await getPublicProjects();
  return (
    <main id="main-content" className="projects-archive">
      <header className="projects-archive__hero">
        <Container>
          <p className="eyebrow">Selected Portfolio / 2018&mdash;2026</p>
          <h1>Our Work</h1>
          <div><p>A portfolio built across sectors,<br />cities and decades.</p><p>We take on projects where clarity, technical depth, and disciplined execution make the difference.</p></div>
        </Container>
      </header>
      <section className="projects-archive__content" aria-label="Project portfolio">
        <Container><ProjectFilter projects={projects} /></Container>
      </section>
    </main>
  );
}
