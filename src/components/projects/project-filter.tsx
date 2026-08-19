"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ImageReveal } from "@/components/motion/image-reveal";
import { projectCategories, type Project, type ProjectCategory } from "@/types/content";

type ProjectFilterValue = "All" | ProjectCategory;

interface ProjectFilterProps {
  projects: Project[];
}

export function ProjectFilter({ projects }: ProjectFilterProps) {
  const [activeFilter, setActiveFilter] = useState<ProjectFilterValue>("All");
  const visibleProjects = activeFilter === "All" ? projects : projects.filter((project) => project.category === activeFilter);
  const filters: ProjectFilterValue[] = ["All", ...projectCategories];

  return (
    <>
      <div className="project-filters" aria-label="Filter projects by sector">
        {filters.map((filter) => (
          <button key={filter} type="button" className={activeFilter === filter ? "is-active" : undefined} aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)}>
            {filter}<span>{String(filter === "All" ? projects.length : projects.filter((project) => project.category === filter).length).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">{visibleProjects.length} projects shown</p>
      {visibleProjects.length > 0 ? (
        <div className="projects-archive__grid">
          {visibleProjects.map((project, index) => (
            <article className={"archive-project archive-project--" + (index % 4)} key={project.slug}>
              <Link className="archive-project__image" href={"/projects/" + project.slug} aria-label={"View " + project.name}>
                <ImageReveal direction={index % 2 === 0 ? "left" : "right"}><Image src={project.cover.src} alt={project.cover.alt} fill sizes="(max-width: 767px) 100vw, (max-width: 1200px) 55vw, 48vw" /></ImageReveal>
                <span>View Project <span aria-hidden="true">↗</span></span>
              </Link>
              <div className="archive-project__meta">
                <p>{String(projects.indexOf(project) + 1).padStart(2, "0")}</p>
                <div><h2><Link href={"/projects/" + project.slug}>{project.name}</Link></h2><p>{project.location}</p></div>
                <p>{project.category}<br />{project.year}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="projects-empty"><p>No projects match this sector.</p><button type="button" onClick={() => setActiveFilter("All")}>View all projects</button></div>
      )}
    </>
  );
}
