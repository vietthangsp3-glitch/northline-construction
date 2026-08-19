import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageReveal } from "@/components/motion/image-reveal";
import { Container } from "@/components/ui/container";
import { getInsight, insights } from "@/data/insights";
import { absoluteUrl } from "@/lib/utils";

interface InsightPageProps {
  params: Promise<{ slug: string }>;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export function generateStaticParams() {
  return insights.map((insight) => ({ slug: insight.slug }));
}

export async function generateMetadata({ params }: InsightPageProps): Promise<Metadata> {
  const { slug } = await params;
  const insight = getInsight(slug);
  if (!insight) return {};
  return {
    title: insight.title,
    description: insight.excerpt,
    alternates: { canonical: "/insights/" + insight.slug },
    openGraph: {
      type: "article",
      title: insight.title,
      description: insight.excerpt,
      publishedTime: insight.publishedAt,
      url: "/insights/" + insight.slug,
      images: [{ url: insight.image.src, width: insight.image.width, height: insight.image.height, alt: insight.image.alt }],
    },
  };
}

export default async function InsightPage({ params }: InsightPageProps) {
  const { slug } = await params;
  const insight = getInsight(slug);
  if (!insight) notFound();

  const insightIndex = insights.findIndex((item) => item.slug === insight.slug);
  const relatedInsight = insights[(insightIndex + 1) % insights.length];
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: insight.title,
    description: insight.excerpt,
    datePublished: insight.publishedAt,
    dateModified: insight.publishedAt,
    image: [insight.image.src],
    author: { "@type": "Organization", name: "Northline Construction & Development", url: absoluteUrl("/") },
    publisher: { "@type": "Organization", name: "Northline Construction & Development", url: absoluteUrl("/") },
    mainEntityOfPage: absoluteUrl("/insights/" + insight.slug),
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Insights", item: absoluteUrl("/insights") },
      { "@type": "ListItem", position: 3, name: insight.title, item: absoluteUrl("/insights/" + insight.slug) },
    ],
  };

  return (
    <main id="main-content" className="article-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\u003c") }} />

      <header className="article-hero">
        <Container>
          <div className="article-hero__meta"><p className="eyebrow">{insight.category} / Perspective</p><Link href="/insights">All Insights</Link></div>
          <h1>{insight.title}</h1>
          <div className="article-hero__bottom"><p>{insight.excerpt}</p><div><time dateTime={insight.publishedAt}>{dateFormatter.format(new Date(insight.publishedAt))}</time><span>{insight.readingTime}</span></div></div>
        </Container>
      </header>

      <figure className="article-image"><ImageReveal direction="up"><Image src={insight.image.src} alt={insight.image.alt} fill priority sizes="100vw" /></ImageReveal></figure>

      <article className="article-body">
        <Container>
          <aside><p className="eyebrow">Northline Perspective</p><p>Written by the Northline Strategy &amp; Preconstruction team.</p></aside>
          <div className="article-body__copy">
            {insight.content.map((paragraph, index) => <p className={index === 0 ? "article-body__lead" : undefined} key={paragraph}>{paragraph}</p>)}
            <h2>Decisions made early shape everything that follows.</h2>
            <p>The practical work is to turn broad ambition into choices a project team can price, coordinate, procure, and verify. That requires owners, designers, builders, and operators to share information before individual solutions become fixed.</p>
            <blockquote>Better outcomes are rarely the result of one dramatic idea. They come from a sequence of clear, informed decisions carried consistently into the field.</blockquote>
            <p>For project teams, the next step is straightforward: identify the few decisions with the greatest downstream impact, give them the right information, and assign clear ownership. Construction performs best when complexity is made visible early.</p>
          </div>
        </Container>
      </article>

      <section className="article-next" aria-label="Related insight">
        <Container>
          <p className="eyebrow">Continue Reading</p>
          <Link href={"/insights/" + relatedInsight.slug}><span>{relatedInsight.category}</span><h2>{relatedInsight.title}</h2><span aria-hidden="true">&nearr;</span></Link>
        </Container>
      </section>
    </main>
  );
}
