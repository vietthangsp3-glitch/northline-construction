import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { getPublicProjects } from "@/lib/content/public";

export async function ProjectBreak() {
  const projects = await getPublicProjects();
  const project = projects[0];
  if (!project) return null;
  return (
    <section className="project-break" aria-label={`Featured project: ${project.name}`}>
      <Image src={project.cover.src} alt={project.cover.alt} fill sizes="100vw" />
      <div className="project-break__scrim" />
      <Container className="project-break__content">
        <div><p className="eyebrow">Feature Project</p><h2><Link href={`/projects/${project.slug}`}>{project.name}</Link></h2><p>{project.location}</p></div>
        <dl><div><dt>Scale</dt><dd>{project.size.toUpperCase()}</dd></div><div><dt>Sector</dt><dd>{project.category}</dd></div></dl>
      </Container>
    </section>
  );
}
