import Image from "next/image";
import Link from "next/link";
import { ImageReveal } from "@/components/motion/image-reveal";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Container } from "@/components/ui/container";
import { getPublicProjects } from "@/lib/content/public";

export async function SelectedWork() {
  const featuredProjects = (await getPublicProjects()).filter((project) => project.featured);
  return (
    <section className="selected-work" aria-labelledby="selected-work-heading">
      <Container>
        <div className="section-heading-row">
          <p className="eyebrow">02 / Featured Projects</p>
          <h2 id="selected-work-heading">Selected Work</h2>
        </div>
        <div className="project-editorial">
          {featuredProjects.slice(0, 5).map((project, index) => (
            <article className={`project-feature project-feature--${index + 1}`} key={project.slug}>
              <Link href={`/projects/${project.slug}`} className="project-feature__image" aria-label={`View ${project.name}`}>
                <ImageReveal direction={index % 2 === 0 ? "left" : "right"} delay={Math.min(index * 0.06, 0.18)}>
                  <Image src={project.cover.src} alt={project.cover.alt} fill sizes={index === 0 || index === 4 ? "(max-width: 767px) 100vw, 90vw" : "(max-width: 767px) 100vw, 50vw"} />
                </ImageReveal>
                <span className="project-feature__view">View Project <span aria-hidden="true">↗</span></span>
              </Link>
              <div className="project-feature__meta">
                <span className="project-feature__number">{String(index + 1).padStart(2, "0")}</span>
                <div><h3><Link href={`/projects/${project.slug}`}>{project.name}</Link></h3><p>{project.location}</p></div>
                <p>{project.category}<br />{project.year}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="selected-work__cta"><ArrowLink href="/projects" label="View All Projects" /></div>
      </Container>
    </section>
  );
}
