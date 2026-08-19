import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { getPublicServices } from "@/lib/content/public";
import type { HomepageCollectionSection } from "@/lib/content/homepage";

export async function Expertise({ config }: { config: HomepageCollectionSection }) {
  const allServices = await getPublicServices();
  const featured = allServices.filter((service) => service.featured);
  const services = featured.length ? featured : allServices;
  return (
    <section className={`expertise expertise--${config.layout}`} aria-labelledby="expertise-heading">
      <Container>
        <div className="section-heading-row section-heading-row--light">
          <p className="eyebrow">{config.eyebrow}</p>
          <div><h2 id="expertise-heading">{config.heading}</h2>{config.subheading && <p>{config.subheading}</p>}</div>
        </div>
        <div className="expertise-list">
          {services.map((service) => (
            <article className="expertise-row" key={service.slug}>
              <span>{service.number}</span>
              <Link href={`/services/${service.slug}`}>
                <h3>{service.name}</h3><span aria-hidden="true">↗</span>
              </Link>
              <div className="expertise-row__preview" aria-hidden="true"><Image src={service.image.src} alt="" fill sizes="22vw" /></div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
