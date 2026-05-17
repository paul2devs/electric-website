"use client";

import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { buttonClassName } from "@/components/ui/button";
import type { ProjectRecord } from "@/lib/data/projects";
import { buildBookFromProjectHref } from "@/lib/projects/booking-bridge";
import { cn } from "@/lib/utils";

type WorkFeaturedProjectProps = {
  project: ProjectRecord;
  onViewDetails: (slug: string) => void;
};

export function WorkFeaturedProject({ project, onViewDetails }: WorkFeaturedProjectProps) {
  const bookHref = buildBookFromProjectHref(project);

  return (
    <section className="border-b border-border bg-surface">
      <Container className="px-8 py-20 sm:px-10 sm:py-24 lg:px-12 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center lg:gap-16">
          <button
            type="button"
            className={cn(
              "group relative isolate block min-h-[16rem] overflow-hidden rounded-sm text-left sm:min-h-[20rem] lg:min-h-[22rem]",
            )}
            onClick={() => onViewDetails(project.slug)}
          >
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover transition-[transform,filter] duration-500 ease-out group-hover:scale-[1.02] group-hover:brightness-[0.92]"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
            <div
              className="absolute inset-0 bg-ink/45 transition-colors duration-300 group-hover:bg-ink/55"
              aria-hidden
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10">
              <p className="text-small font-medium uppercase tracking-[0.14em] text-white/80">
                {project.title}
              </p>
              <p className="mt-2 max-w-md text-body leading-relaxed text-white/95">
                {project.shortDescription}
              </p>
            </div>
          </button>

          <div className="max-w-[26rem]">
            <p className="text-small font-medium uppercase tracking-[0.14em] text-muted">
              Featured project
            </p>
            <h2 className="mt-3 text-title font-semibold leading-tight tracking-tight text-ink">
              {project.title}
            </h2>
            <p className="mt-4 text-body leading-relaxed text-muted">{project.shortDescription}</p>
            <p className="mt-3 text-small text-muted">
              {project.location} · {project.serviceType}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                className={buttonClassName("primary", "w-full justify-center sm:w-auto")}
                onClick={() => onViewDetails(project.slug)}
              >
                View project
              </button>
              <Link
                href={bookHref}
                className={buttonClassName("secondary", "w-full justify-center sm:w-auto")}
              >
                Book similar service
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
