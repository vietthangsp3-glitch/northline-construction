import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageReveal } from "@/components/motion/image-reveal";
import { Container } from "@/components/ui/container";
import { getProject, projects } from "@/data/projects";
import { absoluteUrl } from "@/lib/utils";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: "/projects/" + project.slug },
    openGraph: {
      title: project.name + " | Northline",
      description: project.summary,
      url: "/projects/" + project.slug,
      images: [{ url: project.cover.src, width: project.cover.width, height: project.cover.height, alt: project.cover.alt }],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const projectIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(projectIndex + 1) % projects.length];
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Projects", item: absoluteUrl("/projects") },
      { "@type": "ListItem", position: 3, name: project.name, item: absoluteUrl("/projects/" + project.slug) },
    ],
  };

  return (
    <main id="main-content" className="project-detail">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\u003c") }} />

      <header className="project-detail__hero">
        <Image src={project.cover.src} alt={project.cover.alt} fill priority sizes="100vw" />
        <div className="project-detail__hero-scrim" />
        <Container className="project-detail__hero-content">
          <p className="eyebrow">{project.category} / {project.year}</p>
          <h1>{project.name}</h1>
          <p>{project.location}</p>
        </Container>
      </header>

      <section className="project-overview" aria-labelledby="project-story-heading">
        <Container>
          <dl className="project-meta">
            <div><dt>Client</dt><dd>{project.client}</dd></div>
            <div><dt>Location</dt><dd>{project.location}</dd></div>
            <div><dt>Size</dt><dd>{project.size}</dd></div>
            <div><dt>Sector</dt><dd>{project.category}</dd></div>
            <div><dt>Delivery</dt><dd>{project.delivery}</dd></div>
            <div><dt>Completion</dt><dd>{project.year}</dd></div>
          </dl>
          <div className="project-story">
            <p className="eyebrow">Project Story</p>
            <div>
              <h2 id="project-story-heading">{project.summary}</h2>
              {project.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
        </Container>
      </section>

      <section className="project-gallery" aria-label={project.name + " project gallery"}>
        <figure className="project-gallery__wide"><ImageReveal direction="left"><Image src={project.gallery[0].src} alt={project.gallery[0].alt} fill sizes="100vw" /></ImageReveal></figure>
        <Container>
          <figure className="project-gallery__portrait"><ImageReveal direction="right"><Image src={project.gallery[1].src} alt={project.gallery[1].alt} fill sizes="(max-width: 767px) 100vw, 58vw" /></ImageReveal></figure>
        </Container>
      </section>

      <section className="project-analysis" aria-label="Project delivery">
        <Container>
          <article><p className="eyebrow">The Challenge</p><h2>Making constraints productive.</h2><p>{project.challenge}</p></article>
          <article><p className="eyebrow">Our Approach</p><h2>Planning the work before it reaches the field.</h2><p>{project.approach}</p></article>
          <article><p className="eyebrow">The Outcome</p><h2>Built to perform from day one.</h2><p>{project.outcome}</p></article>
          <dl className="project-outcomes">
            {project.metrics.map((metric) => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}
          </dl>
        </Container>
      </section>

      <section className="next-project" aria-label="Next project">
        <Link href={"/projects/" + nextProject.slug}>
          <Image src={nextProject.cover.src} alt="" fill sizes="100vw" />
          <div className="next-project__scrim" />
          <Container>
            <p className="eyebrow">Next Project</p>
            <h2>{nextProject.name} <span aria-hidden="true">&nearr;</span></h2>
            <p>{nextProject.location}</p>
          </Container>
        </Link>
      </section>
    </main>
  );
}
