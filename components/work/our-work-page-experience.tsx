"use client";

import { useMemo } from "react";

import { Container } from "@/components/layout/container";
import { ServiceFilterNav } from "@/components/services/service-filter-nav";
import { useProjectsBrowse } from "@/hooks/use-projects-browse";
import {
  getFeaturedProject,
  getGridProjects,
  getProjectBySlug,
  getProjectsWithBeforeAfter,
} from "@/lib/data/projects";

import { ProjectDetailsPanel } from "./project-details-panel";
import { WorkBeforeAfter } from "./work-before-after";
import { WorkFeaturedProject } from "./work-featured-project";
import { WorkPageCta } from "./work-page-cta";
import { WorkPageHero } from "./work-page-hero";
import { WorkProjectsGrid } from "./work-projects-grid";

export function OurWorkPageExperience() {
  const featured = getFeaturedProject();
  const gridProjects = getGridProjects();
  const beforeAfterProjects = getProjectsWithBeforeAfter();

  const {
    filterId,
    changeFilter,
    filteredProjects,
    gridOpacity,
    detailSlug,
    openDetail,
    closeDetail,
  } = useProjectsBrowse(gridProjects);

  const detailProject = useMemo(
    () => (detailSlug ? getProjectBySlug(detailSlug) ?? null : null),
    [detailSlug],
  );

  return (
    <>
      <WorkPageHero />
      <div
        id="work-catalogue"
        className="sticky top-[4.25rem] z-30 border-b border-border/80 sm:top-[4.5rem]"
      >
        <ServiceFilterNav value={filterId} onChange={changeFilter} />
      </div>
      <WorkFeaturedProject project={featured} onViewDetails={openDetail} />
      <section className="border-b border-border bg-surface">
        <Container className="px-8 py-16 sm:px-10 sm:py-20 lg:px-12 lg:py-24">
          <div className="mb-10 max-w-xl">
            <h2 className="text-subtitle font-semibold tracking-tight text-ink">Project catalogue</h2>
            <p className="mt-2 text-body text-muted">
              Structured case studies with scope, execution, and outcomes — open any project for
              full detail and booking.
            </p>
          </div>
          <WorkProjectsGrid
            projects={filteredProjects}
            gridOpacity={gridOpacity}
            onOpenDetail={openDetail}
          />
        </Container>
      </section>
      <WorkBeforeAfter projects={beforeAfterProjects} />
      <WorkPageCta />
      <ProjectDetailsPanel
        project={detailProject}
        open={detailSlug !== null && detailProject !== null}
        onClose={closeDetail}
      />
    </>
  );
}
