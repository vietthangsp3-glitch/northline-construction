import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function FinalCta() {
  return (
    <section className="final-cta" aria-labelledby="final-cta-heading">
      <Container>
        <p className="eyebrow">Have a project in mind?</p>
        <div className="final-cta__row">
          <h2 id="final-cta-heading">Let&apos;s build<br />something<br /><span>remarkable.</span></h2>
          <ButtonLink href="/request-a-quote" variant="inverse">Start a Project <span aria-hidden="true">↗</span></ButtonLink>
        </div>
      </Container>
    </section>
  );
}
