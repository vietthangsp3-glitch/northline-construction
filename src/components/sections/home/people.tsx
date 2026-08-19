import Image from "next/image";
import { ImageReveal } from "@/components/motion/image-reveal";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Container } from "@/components/ui/container";
import { team } from "@/data/team";

export function People() {
  return (
    <section className="people" aria-labelledby="people-heading">
      <Container>
        <div className="people__heading"><p className="eyebrow">06 / Leadership</p><h2 id="people-heading">Built by people<br />who care about the details.</h2></div>
        <div className="people__grid">
          {team.slice(0, 4).map((member, index) => (
            <article key={member.name} className={index % 2 ? "person person--offset" : "person"}>
              <div className="person__portrait"><ImageReveal direction={index % 2 === 0 ? "left" : "right"} delay={index * 0.05}><Image src={member.portrait.src} alt={member.portrait.alt} fill sizes="(max-width: 767px) 100vw, 25vw" /></ImageReveal></div>
              <div className="person__meta"><h3>{member.name}</h3><p>{member.role}</p><p>{member.expertise}</p></div>
            </article>
          ))}
        </div>
        <ArrowLink href="/team" label="Meet Our Leadership" />
      </Container>
    </section>
  );
}
