import { Container } from "@/components/ui/container";

const principles = [
  { number: "01", title: "Craftsmanship", copy: "Details are resolved with the same care as the whole. We build for performance, character, and a long useful life." },
  { number: "02", title: "Safety", copy: "Planning and accountability make safe work possible. Every person has the authority to protect the team." },
  { number: "03", title: "Transparency", copy: "Clear information keeps projects moving. We surface risks early and communicate decisions without ambiguity." },
  { number: "04", title: "Accountability", copy: "We own the outcome. Commitments are tracked, standards are measured, and nothing important is left between teams." },
];

const steps = [
  { number: "01", title: "Plan", copy: "We define the real constraints, align priorities, and build a clear path through cost, logistics, and schedule." },
  { number: "02", title: "Design", copy: "Design intent and construction knowledge advance together, resolving risk while opportunity is still open." },
  { number: "03", title: "Build", copy: "Field teams execute against precise plans with disciplined coordination, quality control, and safety leadership." },
  { number: "04", title: "Deliver", copy: "Commissioning begins early. We hand over complete systems, clear records, and a building ready to perform." },
];

export function PrinciplesProcess() {
  return (
    <>
      <section className="principles" aria-labelledby="principles-heading">
        <Container>
          <p className="eyebrow">04 / Why Northline</p>
          <div className="principles__heading">
            <h2 id="principles-heading">Built for complexity.<br />Trusted for delivery.</h2>
            <p>Complex work succeeds when standards stay clear under pressure. Our operating principles guide every decision—from early estimates to the last closeout item.</p>
          </div>
          <div className="principles__list">
            {principles.map((principle) => (
              <article key={principle.number}>
                <span>{principle.number}</span><h3>{principle.title}</h3><p>{principle.copy}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="process" aria-labelledby="process-heading">
        <Container>
          <div className="process__heading"><p className="eyebrow">05 / Our Process</p><h2 id="process-heading">Clarity at<br />every stage.</h2></div>
          <ol className="process__steps">
            {steps.map((step) => (
              <li key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.copy}</p></li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}
