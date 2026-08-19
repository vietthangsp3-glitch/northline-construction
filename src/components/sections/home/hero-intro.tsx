import Image from "next/image";
import { ArrowLink } from "@/components/ui/arrow-link";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { HomepageContent } from "@/lib/content/homepage";

export function HeroIntro({ content }: { content: HomepageContent }) {
  const { hero, about, stats } = content;
  const headingParts = hero.heading.toUpperCase().split(/(?=WHAT'S NEXT\.?$)/);
  return (
    <>
      <section className={`home-hero home-hero--${hero.layout} home-hero--align-${hero.alignment}`} aria-labelledby="hero-heading">
        {hero.image && <Image src={hero.image.url} alt={hero.image.alt} fill priority sizes="100vw" className="home-hero__image home-hero__image--desktop" />}
        {hero.mobileImage && <Image src={hero.mobileImage.url} alt={hero.mobileImage.alt || hero.image?.alt || ""} fill priority sizes="100vw" className="home-hero__image home-hero__image--mobile" />}
        <div className="home-hero__scrim" style={{ opacity: hero.overlay / 100 }} />
        <Container className="home-hero__content">
          <div className="home-hero__body">
            {hero.eyebrow && <p className="eyebrow">{hero.eyebrow}</p>}
            <h1 id="hero-heading">{headingParts.map((part) => <span key={part}>{part}</span>)}</h1>
            <div className="home-hero__footer">
              <p>{hero.description}</p>
              <div className="home-hero__actions">
                <ArrowLink href={hero.primaryCtaUrl} label={hero.primaryCtaText} tone="light" />
                {hero.secondaryCtaEnabled && <ArrowLink href={hero.secondaryCtaUrl} label={hero.secondaryCtaText} tone="light" />}
              </div>
            </div>
          </div>
          <a className="home-hero__scroll" href="#about"><span>Scroll</span><span aria-hidden="true">↓</span></a>
        </Container>
      </section>

      {(about.visible || stats.visible) && <section id="about" className={`home-intro${about.image ? " home-intro--with-media" : ""}`} aria-labelledby="intro-heading">
        <Container>
          {about.visible && <>
          <p className="eyebrow">{about.label}</p>
          <div className="home-intro__grid">
            <h2 id="intro-heading">{about.heading}</h2>
            <div className="home-intro__copy">
              <p>{about.description}</p>
              {about.secondaryDescription && <p>{about.secondaryDescription}</p>}
              {about.ctaText && <ButtonLink href={about.ctaUrl}>{about.ctaText}</ButtonLink>}
            </div>
          </div>
          {about.image && <div className="home-intro__media"><Image src={about.image.url} alt={about.image.alt} fill sizes="(max-width: 767px) 100vw, 75vw" /></div>}
          </>}
          {stats.visible && <dl className="home-stats">
            {stats.items.map((stat) => <div key={`${stat.label}-${stat.value}`}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}
          </dl>}
        </Container>
      </section>}
    </>
  );
}
