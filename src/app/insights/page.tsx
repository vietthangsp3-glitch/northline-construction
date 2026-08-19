import Image from "next/image";
import Link from "next/link";
import { ImageReveal } from "@/components/motion/image-reveal";
import { Container } from "@/components/ui/container";
import { insights } from "@/data/insights";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Insights",
  description: "Perspectives from Northline on construction, design, sustainability, and project delivery.",
  path: "/insights",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export default function InsightsPage() {
  const [leadInsight, ...remainingInsights] = insights;
  return (
    <main id="main-content" className="insights-page">
      <header className="insights-hero">
        <Container>
          <p className="eyebrow">Ideas / News / Perspective</p>
          <h1>Insights</h1>
          <p>Clear thinking for the decisions that shape projects, buildings, and the future of construction.</p>
        </Container>
      </header>

      <section className="insights-feature" aria-labelledby="featured-insight-heading">
        <Container>
          <Link className="insights-feature__image" href={"/insights/" + leadInsight.slug}><ImageReveal direction="left"><Image src={leadInsight.image.src} alt={leadInsight.image.alt} fill priority sizes="(max-width: 767px) 100vw, 64vw" /></ImageReveal></Link>
          <article>
            <p className="eyebrow">Featured / {leadInsight.category}</p>
            <h2 id="featured-insight-heading"><Link href={"/insights/" + leadInsight.slug}>{leadInsight.title}</Link></h2>
            <p>{leadInsight.excerpt}</p>
            <div><time dateTime={leadInsight.publishedAt}>{dateFormatter.format(new Date(leadInsight.publishedAt))}</time><span>{leadInsight.readingTime}</span></div>
            <Link className="insights-read-link" href={"/insights/" + leadInsight.slug}>Read Insight <span aria-hidden="true">&nearr;</span></Link>
          </article>
        </Container>
      </section>

      <section className="insights-list" aria-label="Latest insights">
        <Container>
          <div className="insights-list__heading"><p className="eyebrow">Latest Thinking</p><p>{String(insights.length).padStart(2, "0")} Articles</p></div>
          <div className="insights-list__grid">
            {remainingInsights.map((insight) => (
              <article key={insight.slug}>
                <Link className="insights-list__image" href={"/insights/" + insight.slug}><ImageReveal direction={remainingInsights.indexOf(insight) % 2 === 0 ? "left" : "right"}><Image src={insight.image.src} alt={insight.image.alt} fill sizes="(max-width: 767px) 100vw, 50vw" /></ImageReveal></Link>
                <div className="insights-list__meta"><span>{insight.category}</span><time dateTime={insight.publishedAt}>{dateFormatter.format(new Date(insight.publishedAt))}</time></div>
                <h2><Link href={"/insights/" + insight.slug}>{insight.title}</Link></h2>
                <p>{insight.excerpt}</p>
                <Link className="insights-read-link" href={"/insights/" + insight.slug}>Read Article <span aria-hidden="true">&nearr;</span></Link>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
