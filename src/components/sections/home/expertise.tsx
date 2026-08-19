import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { services } from "@/data/services";

export function Expertise() {
  return (
    <section className="expertise" aria-labelledby="expertise-heading">
      <Container>
        <div className="section-heading-row section-heading-row--light">
          <p className="eyebrow">03 / What We Do</p>
          <h2 id="expertise-heading">Expertise</h2>
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
