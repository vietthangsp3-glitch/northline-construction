import type { Insight } from "@/types/content";

export const insights: Insight[] = [
  {
    slug: "future-of-sustainable-construction",
    title: "The Future of Sustainable Construction",
    excerpt: "How material intelligence, electrification, and better delivery models are changing what responsible construction looks like.",
    category: "Sustainability",
    publishedAt: "2026-05-12",
    readingTime: "6 min read",
    image: { src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1600&q=85", alt: "High-performance facade on a sustainable building", width: 1600, height: 1000 },
    content: ["Sustainable construction is moving from a collection of project targets to a practical way of making everyday decisions. The most effective teams now measure carbon, energy, resilience, and long-term adaptability alongside cost and schedule.", "That shift makes early collaboration essential. Structural choices, facade performance, procurement routes, and building systems all influence one another. The opportunity is greatest before those decisions harden into documents and purchase orders."],
  },
  {
    slug: "commercial-spaces-next-decade",
    title: "Designing Commercial Spaces for the Next Decade",
    excerpt: "The buildings that last will be the ones ready to change—without losing their identity or performance.",
    category: "Perspective",
    publishedAt: "2026-03-24",
    readingTime: "5 min read",
    image: { src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85", alt: "Flexible modern commercial interior", width: 1600, height: 1000 },
    content: ["Commercial buildings face a faster cycle of change than their structures. Work patterns, tenant expectations, technology, and climate standards may all move several times over a building's useful life.", "Adaptability is not an abstract design ambition. It depends on practical choices: generous planning modules, accessible services, durable shared spaces, and systems that can be maintained without disrupting whole floors."],
  },
  {
    slug: "why-preconstruction-determines-success",
    title: "Why Preconstruction Determines Project Success",
    excerpt: "Complex projects become manageable when the difficult questions are asked early and answered with evidence.",
    category: "Process",
    publishedAt: "2026-01-29",
    readingTime: "7 min read",
    image: { src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=85", alt: "Design and construction plans under review", width: 1600, height: 1000 },
    content: ["Preconstruction is where a project becomes executable. It is the time to test assumptions, expose dependencies, and understand the decisions that genuinely control budget and schedule.", "A useful preconstruction process produces clarity, not paperwork. Owners should leave each stage knowing what has changed, why it matters, and what decision comes next."],
  },
];

export function getInsight(slug: string) {
  return insights.find((insight) => insight.slug === slug);
}
