import { ProjectFilter } from "@/components/projects/project-filter";
import { Container } from "@/components/ui/container";
import { getPublicProjects } from "@/lib/content/public";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Projects",
  description: "Explore Northline's commercial, residential, hospitality, healthcare, and corporate construction portfolio.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const projects = await getPublicProjects();
  return (
    <main id="main-content" className="projects-archive">
      <header className="projects-archive__hero">
        <Container>
          <p className="eyebrow">Selected Portfolio / 2018&mdash;2026</p>
          <h1>Our Work</h1>
          <div><p>A portfolio built across sectors,<br />cities and decades.</p><p>We take on projects where clarity, technical depth, and disciplined execution make the difference.</p></div>
        </Container>
      </header>
      <section className="projects-archive__content" aria-label="Project portfolio">
        <Container><ProjectFilter projects={projects} /></Container>
      </section>
    </main>
  );
}
