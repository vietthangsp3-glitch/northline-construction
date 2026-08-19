import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { projects } from "@/data/projects";

export function ProjectBreak() {
  const project = projects[0];
  return (
    <section className="project-break" aria-label="Featured project: The Meridian">
      <Image src={project.cover.src} alt={project.cover.alt} fill sizes="100vw" />
      <div className="project-break__scrim" />
      <Container className="project-break__content">
        <div><p className="eyebrow">Feature Project</p><h2><Link href={`/projects/${project.slug}`}>{project.name}</Link></h2><p>{project.location}</p></div>
        <dl><div><dt>Scale</dt><dd>{project.size.toUpperCase()}</dd></div><div><dt>Sector</dt><dd>Commercial Development</dd></div></dl>
      </Container>
    </section>
  );
}
