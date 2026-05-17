"use client";

import Image from "next/image";

import type { ProjectRecord } from "@/lib/data/projects";

type WorkProjectsGridProps = {
  projects: readonly ProjectRecord[];
  gridOpacity: number;
  onOpenDetail: (slug: string) => void;
};

export function WorkProjectsGrid({ projects, gridOpacity, onOpenDetail }: WorkProjectsGridProps) {
  return (
    <div
      className="transition-opacity duration-200 ease-out"
      style={{ opacity: gridOpacity }}
    >
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        {projects.map((project) => (
          <WorkProjectCard key={project.slug} project={project} onOpenDetail={onOpenDetail} />
        ))}
      </div>
      {projects.length === 0 ? (
        <p className="mt-8 text-body text-muted">No projects in this category yet.</p>
      ) : null}
    </div>
  );
}

type WorkProjectCardProps = {
  project: ProjectRecord;
  onOpenDetail: (slug: string) => void;
};

function WorkProjectCard({ project, onOpenDetail }: WorkProjectCardProps) {
  return (
    <article className="group flex flex-col">
      <button
        type="button"
        className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-sm bg-hover text-left"
        onClick={() => onOpenDetail(project.slug)}
      >
        <Image
          src={project.coverImage}
          alt=""
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div
          className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/10"
          aria-hidden
        />
      </button>
      <div className="flex flex-1 flex-col border-t border-border pt-4">
        <button
          type="button"
          className="text-left"
          onClick={() => onOpenDetail(project.slug)}
        >
          <h3 className="text-body font-semibold tracking-tight text-ink transition-colors group-hover:text-ink">
            {project.title}
          </h3>
        </button>
        <p className="mt-2 flex-1 text-small leading-relaxed text-muted">{project.shortDescription}</p>
        <button
          type="button"
          className="mt-4 flex w-fit items-center gap-1 text-small font-medium text-muted transition-[color,transform] duration-200 group-hover:text-ink group-hover:[&>span:last-child]:translate-x-0.5"
          onClick={() => onOpenDetail(project.slug)}
        >
          <span>View details</span>
          <span aria-hidden>→</span>
        </button>
      </div>
    </article>
  );
}
