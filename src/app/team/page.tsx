import Image from "next/image";
import { ImageReveal } from "@/components/motion/image-reveal";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { team } from "@/data/team";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Leadership",
  description: "Meet the leadership team guiding Northline's projects, people, and construction standards.",
  path: "/team",
});

export default function TeamPage() {
  return (
    <main id="main-content" className="team-page">
      <header className="team-hero">
        <Container>
          <p className="eyebrow">Leadership / Northline</p>
          <h1>Built by people<br /><span>who stay close<br />to the work.</span></h1>
          <p>Our leaders bring different disciplines to one responsibility: making good decisions visible and executable.</p>
        </Container>
      </header>

      <section className="team-directory" aria-label="Northline leadership">
        <Container>
          {team.map((member, index) => (
            <article key={member.name} className={index % 2 ? "team-profile team-profile--reverse" : "team-profile"}>
              <figure><ImageReveal direction={index % 2 === 0 ? "left" : "right"}><Image src={member.portrait.src} alt={member.portrait.alt} fill sizes="(max-width: 767px) 100vw, 47vw" /></ImageReveal></figure>
              <div className="team-profile__content"><p className="eyebrow">{String(index + 1).padStart(2, "0")} / Leadership</p><h2>{member.name}</h2><p className="team-profile__role">{member.role}</p><p>{member.biography}</p><dl><dt>Area of focus</dt><dd>{member.expertise}</dd></dl></div>
            </article>
          ))}
        </Container>
      </section>

      <section className="team-culture">
        <Container>
          <div><p className="eyebrow">Careers / Culture</p><h2>Do the best work<br />of your career.</h2></div>
          <div><p>Northline is built around people who ask better questions, share what they know, and take pride in getting the details right. We invest in field experience, mentorship, and clear paths for growth.</p><ButtonLink href="/contact" variant="secondary">Start a Conversation <span aria-hidden="true">↗</span></ButtonLink></div>
        </Container>
      </section>
    </main>
  );
}
