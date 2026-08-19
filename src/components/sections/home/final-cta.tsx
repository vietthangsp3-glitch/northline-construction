import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import Image from "next/image";
import type { HomepageCta } from "@/lib/content/homepage";

export function FinalCta({ config }: { config: HomepageCta }) {
  return (
    <section className={`final-cta${config.image ? " final-cta--with-image" : ""}`} aria-labelledby="final-cta-heading">
      {config.image && <><Image src={config.image.url} alt={config.image.alt} fill sizes="100vw" className="final-cta__image"/><div className="final-cta__scrim" /></>}
      <Container>
        <p className="eyebrow">{config.eyebrow}</p>
        <div className="final-cta__row">
          <div><h2 id="final-cta-heading">{config.heading}</h2>{config.description && <p>{config.description}</p>}</div>
          <ButtonLink href={config.buttonUrl} variant="inverse">{config.buttonText} <span aria-hidden="true">↗</span></ButtonLink>
        </div>
      </Container>
    </section>
  );
}
