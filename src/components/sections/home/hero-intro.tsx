import Image from "next/image";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Container } from "@/components/ui/container";

const stats = [
  { value: "25+", label: "Years of Experience" },
  { value: "180+", label: "Projects Delivered" },
  { value: "$1.2B+", label: "Project Value" },
  { value: "14", label: "Industry Awards" },
];

export function HeroIntro() {
  return (
    <>
      <section className="home-hero" aria-labelledby="hero-heading">
        <Image src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=88" alt="Modern high-rise architecture rising into a clear sky" fill priority sizes="100vw" className="home-hero__image" />
        <div className="home-hero__scrim" />
        <Container className="home-hero__content">
          <div className="home-hero__body">
            <p className="eyebrow">New York · Building Nationwide</p>
            <h1 id="hero-heading"><span>WE BUILD</span><span>WHAT&apos;S NEXT.</span></h1>
            <div className="home-hero__footer">
              <p>Building exceptional spaces through precision, craftsmanship and purpose.</p>
              <div className="home-hero__actions">
                <ArrowLink href="/projects" label="Explore Our Work" tone="light" />
                <ArrowLink href="/request-a-quote" label="Start a Project" tone="light" />
              </div>
            </div>
          </div>
          <a className="home-hero__scroll" href="#about"><span>Scroll</span><span aria-hidden="true">↓</span></a>
        </Container>
      </section>

      <section id="about" className="home-intro" aria-labelledby="intro-heading">
        <Container>
          <p className="eyebrow">01 / About Northline</p>
          <div className="home-intro__grid">
            <h2 id="intro-heading">Built on precision.<br />Driven by possibility.</h2>
            <div className="home-intro__copy">
              <p>Northline builds places where people work, live, heal, gather, and move forward. For more than 25 years, we have brought discipline to demanding projects across the United States—aligning design intent with real-world execution from the earliest decision through final handover.</p>
              <p>Our teams pair construction knowledge with direct communication and an exacting standard of craft. The result is work that performs under pressure and holds its value over time.</p>
            </div>
          </div>
          <dl className="home-stats">
            {stats.map((stat) => <div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}
          </dl>
        </Container>
      </section>
    </>
  );
}
