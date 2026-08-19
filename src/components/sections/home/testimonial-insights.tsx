import Image from "next/image";
import Link from "next/link";
import { ImageReveal } from "@/components/motion/image-reveal";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Container } from "@/components/ui/container";
import { insights } from "@/data/insights";
import { testimonials } from "@/data/testimonials";
import { getPublicTestimonials } from "@/lib/content/public";
import type { HomepageTestimonials } from "@/lib/content/homepage";

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export async function TestimonialInsights({ config }: { config: HomepageTestimonials }) {
  const managedTestimonials = await getPublicTestimonials();
  const testimonial = managedTestimonials[0] || testimonials[0];
  return (
    <>
      {config.visible && testimonial && <section className="testimonial" aria-labelledby="testimonial-heading">
        <Container>
          <p className="eyebrow">{config.eyebrow}</p>
          <blockquote>
            <p id="testimonial-heading">“{testimonial.quote}”</p>
            <footer><strong>{testimonial.author}</strong><span>{testimonial.role}<br />{testimonial.company}</span></footer>
          </blockquote>
        </Container>
      </section>}
      <section className="insights-preview" aria-labelledby="insights-heading">
        <Container>
          <div className="insights-preview__heading"><div><p className="eyebrow">08 / Ideas &amp; News</p><h2 id="insights-heading">Insights</h2></div><ArrowLink href="/insights" label="View All Insights" /></div>
          <div className="insights-preview__grid">
            {insights.slice(0, 3).map((insight) => (
              <article key={insight.slug}>
                <Link className="insight-card__image" href={`/insights/${insight.slug}`} aria-label={`Read ${insight.title}`}><ImageReveal direction={insights.indexOf(insight) % 2 === 0 ? "left" : "right"} delay={insights.indexOf(insight) * 0.05}><Image src={insight.image.src} alt={insight.image.alt} fill sizes="(max-width: 767px) 100vw, 33vw" /></ImageReveal></Link>
                <div className="insight-card__meta"><p>{insight.category}</p><time dateTime={insight.publishedAt}>{dateFormatter.format(new Date(insight.publishedAt))}</time></div>
                <h3><Link href={`/insights/${insight.slug}`}>{insight.title}</Link></h3>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
