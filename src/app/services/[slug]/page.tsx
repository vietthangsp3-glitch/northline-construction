import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageReveal } from "@/components/motion/image-reveal";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { services as fallbackServices } from "@/data/services";
import { getPublicProjects, getPublicService } from "@/lib/content/public";
import { absoluteUrl } from "@/lib/utils";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

const deliverySteps = [
  { number: "01", title: "Define", copy: "Align scope, priorities, risk, and the decisions that will control the project." },
  { number: "02", title: "Resolve", copy: "Test options with real cost, schedule, logistics, and constructability information." },
  { number: "03", title: "Execute", copy: "Coordinate the work through disciplined field leadership and quality control." },
  { number: "04", title: "Verify", copy: "Commission, document, and hand over a complete project ready to perform." },
];

export function generateStaticParams() {
  return fallbackServices.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getPublicService(slug);
  if (!service) return {};
  return {
    title: service.seoTitle || service.name,
    description: service.seoDescription || service.introduction,
    alternates: { canonical: service.canonicalUrl || "/services/" + service.slug },
    openGraph: {
      title: service.seoTitle || service.name + " | Northline",
      description: service.seoDescription || service.introduction,
      url: service.canonicalUrl || "/services/" + service.slug,
      images: [{ url: (service.ogImage || service.image).src, width: (service.ogImage || service.image).width, height: (service.ogImage || service.image).height, alt: (service.ogImage || service.image).alt }],
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const [service, projects] = await Promise.all([getPublicService(slug), getPublicProjects()]);
  if (!service) notFound();

  const relatedProjects = service.relatedProjectSlugs
    .map((projectSlug) => projects.find((project) => project.slug === projectSlug))
    .filter((project) => project !== undefined);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Expertise", item: absoluteUrl("/services") },
      { "@type": "ListItem", position: 3, name: service.name, item: absoluteUrl("/services/" + service.slug) },
    ],
  };

  return (
    <main id="main-content" className="service-detail">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\u003c") }} />

      <header className="service-detail__hero">
        <Container>
          <div className="service-detail__hero-top"><p className="eyebrow">Expertise / {service.number}</p><Link href="/services">All Services</Link></div>
          <h1>{service.name}</h1>
          <div className="service-detail__hero-bottom"><p>{service.summary}</p><span aria-hidden="true">{service.number}</span></div>
        </Container>
      </header>

      <section className="service-introduction" aria-labelledby="service-introduction-heading">
        <Container>
          <p className="eyebrow">What We Deliver</p>
          <div>
            <h2 id="service-introduction-heading">{service.introduction}</h2>
            <p>Complex projects demand direct answers. Northline brings experienced leadership into the conversation early, keeps responsibility visible, and carries critical knowledge from planning into the field.</p>
          </div>
        </Container>
      </section>

      <figure className="service-detail__image">
        <ImageReveal direction="up"><Image src={service.image.src} alt={service.image.alt} fill priority sizes="100vw" /></ImageReveal>
      </figure>

      <section className="service-capabilities" aria-labelledby="capabilities-heading">
        <Container>
          <div className="service-capabilities__heading"><p className="eyebrow">Capabilities</p><h2 id="capabilities-heading">Focused expertise.<br />Integrated delivery.</h2></div>
          <ol>
            {service.capabilities.map((capability, index) => <li key={capability}><span>{String(index + 1).padStart(2, "0")}</span><h3>{capability}</h3></li>)}
          </ol>
        </Container>
      </section>

      <section className="service-delivery" aria-labelledby="delivery-heading">
        <Container>
          <div className="service-delivery__heading"><p className="eyebrow">Our Approach</p><h2 id="delivery-heading">A clear path<br />through complexity.</h2></div>
          <ol>
            {deliverySteps.map((step) => <li key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.copy}</p></li>)}
          </ol>
        </Container>
      </section>

      <section className="service-projects" aria-labelledby="related-projects-heading">
        <Container>
          <div className="service-projects__heading"><div><p className="eyebrow">Selected Experience</p><h2 id="related-projects-heading">Related Projects</h2></div><Link href="/projects">View All Work <span aria-hidden="true">↗</span></Link></div>
          <div className="service-projects__grid">
            {relatedProjects.map((project) => (
              <article key={project.slug}>
                <Link className="service-project__image" href={"/projects/" + project.slug}><ImageReveal direction={relatedProjects.indexOf(project) % 2 === 0 ? "left" : "right"}><Image src={project.cover.src} alt={project.cover.alt} fill sizes="(max-width: 767px) 100vw, 50vw" /></ImageReveal></Link>
                <div><h3><Link href={"/projects/" + project.slug}>{project.name}</Link></h3><p>{project.location} / {project.year}</p></div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="service-cta">
        <Container>
          <p className="eyebrow">Start a Conversation</p>
          <div><h2>Bring us the<br />hard questions.</h2><ButtonLink href="/request-a-quote" variant="inverse">Start a Project <span aria-hidden="true">↗</span></ButtonLink></div>
        </Container>
      </section>
    </main>
  );
}
