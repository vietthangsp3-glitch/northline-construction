import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/ui";

export const metadata = { title: "Website Content" };

const areas = [
  { href: "/admin/content/homepage", title: "Homepage", copy: "Hero, about, statistics, featured services and projects, testimonials, CTA, and homepage SEO." },
  { href: "/admin/content/testimonials", title: "Testimonials", copy: "Client quotes, attribution, avatars, project references, ordering, and publishing." },
  { href: "/admin/settings", title: "Contact & footer", copy: "Business information, contact labels, social profiles, and footer copy." },
  { href: "/admin/settings/seo", title: "Global SEO", copy: "Site-wide search metadata and social preview images for key listing pages." },
];

export default function ContentPage() {
  return <main className="admin-page"><AdminPageHeader eyebrow="Content / Website" title="Website content" description="Curated controls keep every public page on-brand while making routine updates straightforward."/><div className="admin-content-cards">{areas.map((area)=><Link href={area.href} key={area.href}><span>Open editor ↗</span><h2>{area.title}</h2><p>{area.copy}</p></Link>)}</div></main>;
}
