import type { Service } from "@/types/content";

export const services: Service[] = [
  {
    slug: "commercial-construction",
    name: "Commercial Construction",
    number: "01",
    summary: "Complex commercial environments built for lasting performance.",
    introduction: "We coordinate people, systems, and decisions from mobilization through closeout, giving owners clear control over quality, cost, and schedule.",
    capabilities: ["Core and shell", "Tenant improvements", "Mixed-use development", "Building repositioning"],
    relatedProjectSlugs: ["the-meridian", "union-exchange"],
    image: { src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85", alt: "Modern commercial tower facade", width: 1600, height: 1100 },
  },
  {
    slug: "residential-construction",
    name: "Residential Construction",
    number: "02",
    summary: "Exceptional homes delivered with discretion and exacting craft.",
    introduction: "Our residential teams pair rigorous management with a deep respect for architecture, materials, and the people who make them.",
    capabilities: ["Custom residences", "Multi-family", "Historic homes", "Interior fit-out"],
    relatedProjectSlugs: ["cedar-house", "park-avenue-residence"],
    image: { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85", alt: "Contemporary custom residence", width: 1600, height: 1100 },
  },
  {
    slug: "preconstruction",
    name: "Preconstruction",
    number: "03",
    summary: "Better information before construction begins.",
    introduction: "We test scope, logistics, schedule, and cost early so the team can commit to the right decisions with confidence.",
    capabilities: ["Cost planning", "Constructability reviews", "Value analysis", "Procurement strategy"],
    relatedProjectSlugs: ["atlas-technology-campus", "northpoint-medical-center"],
    image: { src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=85", alt: "Architect reviewing construction plans", width: 1600, height: 1100 },
  },
  {
    slug: "design-build",
    name: "Design-Build",
    number: "04",
    summary: "One accountable team from first concept to final delivery.",
    introduction: "Design and construction thinking move together, shortening feedback loops and keeping ambition aligned with execution.",
    capabilities: ["Design management", "Consultant coordination", "Permit strategy", "Integrated delivery"],
    relatedProjectSlugs: ["the-meridian", "atlas-technology-campus"],
    image: { src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=85", alt: "Construction team coordinating on site", width: 1600, height: 1100 },
  },
  {
    slug: "renovation",
    name: "Renovation",
    number: "05",
    summary: "Existing buildings renewed with intelligence and care.",
    introduction: "We uncover constraints early, protect what matters, and sequence work around active operations when a building cannot simply stop.",
    capabilities: ["Historic restoration", "Adaptive reuse", "Occupied renovation", "Infrastructure upgrades"],
    relatedProjectSlugs: ["westline-headquarters", "park-avenue-residence"],
    image: { src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=85", alt: "Craftsperson working on building renovation", width: 1600, height: 1100 },
  },
  {
    slug: "construction-management",
    name: "Construction Management",
    number: "06",
    summary: "Clear leadership across every phase and stakeholder.",
    introduction: "Our teams create reliable systems for communication, procurement, quality, safety, and field execution on projects of every scale.",
    capabilities: ["Program management", "Field operations", "Quality control", "Commissioning and closeout"],
    relatedProjectSlugs: ["harbour-hotel", "cedar-house"],
    image: { src: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=85", alt: "Construction managers reviewing an active jobsite", width: 1600, height: 1100 },
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
