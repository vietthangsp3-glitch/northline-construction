import Image from "next/image";
import Link from "next/link";
import { ImageReveal } from "@/components/motion/image-reveal";
import { Container } from "@/components/ui/container";
import { getPublicServices } from "@/lib/content/public";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Construction Services",
  description: "Explore Northline's commercial, residential, preconstruction, design-build, renovation, and construction management expertise.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getPublicServices();
  return (
    <main id="main-content" className="services-archive">
      <header className="services-archive__hero">
        <Container>
          <p className="eyebrow">Expertise / Built Around Your Project</p>
          <h1>Expertise built<br />around <span>your project.</span></h1>
          <div className="services-archive__intro">
            <p>Every project asks different questions. Our teams bring the right technical depth, delivery structure, and field leadership to answer them clearly.</p>
            <p>From the first estimate through commissioning, we connect decisions across design, cost, schedule, procurement, and construction.</p>
          </div>
        </Container>
      </header>

      <section className="services-archive__list" aria-label="Construction services">
        <Container>
          {services.map((service) => (
            <article className="service-feature" key={service.slug}>
              <div className="service-feature__number">{service.number}</div>
              <div className="service-feature__body">
                <h2><Link href={"/services/" + service.slug}>{service.name}</Link></h2>
                <p>{service.summary}</p>
                <Link className="service-feature__link" href={"/services/" + service.slug}>Explore Service <span aria-hidden="true">&nearr;</span></Link>
              </div>
              <Link className="service-feature__image" href={"/services/" + service.slug} aria-label={"Explore " + service.name}>
                <ImageReveal direction={Number(service.number) % 2 === 0 ? "right" : "left"}><Image src={service.image.src} alt={service.image.alt} fill sizes="(max-width: 767px) 100vw, 36vw" /></ImageReveal>
              </Link>
            </article>
          ))}
        </Container>
      </section>

      <section className="services-archive__closing">
        <Container>
          <p className="eyebrow">One Standard / Every Delivery Model</p>
          <p>How a project is structured matters. What never changes is our accountability for the result.</p>
        </Container>
      </section>
    </main>
  );
}
