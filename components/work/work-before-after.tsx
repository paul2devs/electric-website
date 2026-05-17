"use client";

import Image from "next/image";

import { Container } from "@/components/layout/container";
import type { ProjectRecord } from "@/lib/data/projects";

type WorkBeforeAfterProps = {
  projects: readonly ProjectRecord[];
};

export function WorkBeforeAfter({ projects }: WorkBeforeAfterProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-border bg-[#f7f7f7]">
      <Container className="px-8 py-20 sm:px-10 sm:py-24 lg:px-12 lg:py-28">
        <div className="mb-12 max-w-xl">
          <h2 className="text-subtitle font-semibold tracking-tight text-ink">Before & after</h2>
          <p className="mt-2 text-body text-muted">
            Documented transformations that show scope, execution, and finished results.
          </p>
        </div>
        <ul className="grid gap-12 lg:grid-cols-2">
          {projects.map((project) => (
            <li key={project.slug}>
              <p className="text-small font-semibold text-ink">{project.title}</p>
              <p className="mt-1 text-small text-muted">{project.location}</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <figure>
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
                    Before
                  </p>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-hover">
                    {project.beforeImage ? (
                      <Image
                        src={project.beforeImage}
                        alt={`${project.title} before`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 50vw, 25vw"
                      />
                    ) : null}
                  </div>
                </figure>
                <figure>
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
                    After
                  </p>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-hover">
                    {project.afterImage ? (
                      <Image
                        src={project.afterImage}
                        alt={`${project.title} after`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 50vw, 25vw"
                      />
                    ) : null}
                  </div>
                </figure>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
