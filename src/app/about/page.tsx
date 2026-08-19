import Image from "next/image";
import { ImageReveal } from "@/components/motion/image-reveal";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "About Northline",
  description: "Meet the people, principles, and construction discipline behind Northline Construction & Development.",
  path: "/about",
});

const milestones = [
  { year: "2001", title: "Northline founded", copy: "A field-led construction practice begins in New York with a focus on complex commercial work." },
  { year: "2009", title: "Integrated preconstruction", copy: "Dedicated cost, planning, and design-management teams bring decisions forward." },
  { year: "2017", title: "National delivery", copy: "Regional teams expand Northline's reach while maintaining one operating standard." },
  { year: "2026", title: "Building what is next", copy: "More than 180 projects delivered across the places where people live, work, heal, and gather." },
];

const values = [
  { number: "01", title: "Build with care", copy: "We respect the design, the craft, the site, and every person responsible for the work." },
  { number: "02", title: "Make it clear", copy: "Useful information arrives early. Risks are visible, decisions have owners, and communication stays direct." },
  { number: "03", title: "Own the result", copy: "We do not pass problems between teams. Accountability follows the project from first estimate through closeout." },
  { number: "04", title: "Think beyond handover", copy: "A successful building must perform for the people who operate, occupy, and adapt it over time." },
];

export default function AboutPage() {
  return (
    <main id="main-content" className="company-page">
      <header className="company-hero">
        <Container>
          <p className="eyebrow">Company / Since 2001</p>
          <h1>We build with<br /><span>purpose.</span></h1>
          <div className="company-hero__intro"><p>Northline is a construction and development company built for projects where the details matter and the stakes are high.</p><p>We bring design, cost, and construction thinking together to give owners a clear path from possibility to performance.</p></div>
        </Container>
      </header>

      <figure className="company-page__image"><ImageReveal direction="up"><Image src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2400&q=88" alt="Construction team reviewing plans beside a major project" fill priority sizes="100vw" /></ImageReveal></figure>

      <section className="company-story" aria-labelledby="company-story-heading">
        <Container>
          <p className="eyebrow">Our Story</p>
          <div><h2 id="company-story-heading">Construction knowledge.<br />Development perspective.</h2><p>Northline began with a simple belief: demanding projects need builders at the table early. That principle still shapes how we work. Our teams connect decisions across design, procurement, logistics, safety, quality, and operations before those decisions become constraints in the field.</p><p>We have grown deliberately, adding expertise where it strengthens delivery while keeping senior leadership close to the work. Today, Northline builds across the United States with one shared standard for clarity, craftsmanship, and accountability.</p></div>
        </Container>
      </section>

      <section className="company-history" aria-labelledby="history-heading">
        <Container>
          <div className="company-history__heading"><p className="eyebrow">25 Years / One Standard</p><h2 id="history-heading">Built over time.</h2></div>
          <ol>{milestones.map((item) => <li key={item.year}><span>{item.year}</span><h3>{item.title}</h3><p>{item.copy}</p></li>)}</ol>
        </Container>
      </section>

      <section className="company-values" aria-labelledby="values-heading">
        <Container>
          <div className="company-values__heading"><p className="eyebrow">What Guides Us</p><h2 id="values-heading">Standards that<br />show up in the work.</h2></div>
          <div className="company-values__grid">{values.map((value) => <article key={value.number}><span>{value.number}</span><h3>{value.title}</h3><p>{value.copy}</p></article>)}</div>
        </Container>
      </section>

      <section className="sustainability" aria-labelledby="sustainability-heading">
        <Container>
          <div className="sustainability__media"><ImageReveal direction="left"><Image src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=88" alt="High-performance building facade designed for daylight and energy efficiency" fill sizes="(max-width: 767px) 100vw, 50vw" /></ImageReveal></div>
          <div className="sustainability__content"><p className="eyebrow">Responsibility / Performance</p><h2 id="sustainability-heading">Build less waste.<br />Create more value.</h2><p>Responsible construction starts with better decisions: retain what can be reused, measure material impacts, reduce energy demand, procure intelligently, and build assemblies that last. We bring those choices into cost and schedule conversations early, where they can make the greatest difference.</p><dl><div><dt>Waste diversion target</dt><dd>90%</dd></div><div><dt>Projects tracking embodied carbon</dt><dd>100%</dd></div></dl></div>
        </Container>
      </section>

      <section className="company-people-cta">
        <Container><p className="eyebrow">The People Behind the Work</p><div><h2>Experience matters.<br />So does curiosity.</h2><ButtonLink href="/team">Meet Our Leadership <span aria-hidden="true">↗</span></ButtonLink></div></Container>
      </section>
    </main>
  );
}
