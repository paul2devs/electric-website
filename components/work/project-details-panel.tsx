"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { buttonClassName } from "@/components/ui/button";
import { routes } from "@/lib/constants/routes";
import type { ProjectRecord } from "@/lib/data/projects";
import {
  buildAskAboutProjectHref,
  buildBookFromProjectHref,
} from "@/lib/projects/booking-bridge";
import { cn } from "@/lib/utils";

type ProjectDetailsPanelProps = {
  project: ProjectRecord | null;
  open: boolean;
  onClose: () => void;
};

export function ProjectDetailsPanel({ project, open, onClose }: ProjectDetailsPanelProps) {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (!open) {
      return;
    }
    queueMicrotask(() => {
      setImageIndex(0);
    });
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open, project?.slug]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !project) {
    return null;
  }

  const images = project.images.length > 0 ? project.images : [project.coverImage];
  const activeImage = images[imageIndex] ?? project.coverImage;
  const bookHref = buildBookFromProjectHref(project);
  const askHref = buildAskAboutProjectHref(project);
  const serviceHref = routes.serviceDetail(project.relatedServiceSlug);

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-ink/35 transition-opacity duration-300"
        aria-label="Close project details"
        onClick={onClose}
      />
      <aside
        className="project-panel-aside relative flex h-full w-full max-w-[min(100vw,32rem)] flex-col border-l border-border bg-surface shadow-[0_0_0_1px_rgba(0,0,0,0.04)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-panel-title"
      >
        <header className="shrink-0 border-b border-border px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="project-panel-title" className="text-subtitle font-semibold tracking-tight text-ink">
                {project.title}
              </h2>
              <p className="mt-1 text-small text-muted">{project.subtitle}</p>
            </div>
            <button
              type="button"
              className="rounded-sm px-2 py-1 text-small font-medium text-muted transition-colors hover:bg-hover hover:text-ink"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="relative aspect-[4/3] w-full bg-hover">
            <Image
              src={activeImage}
              alt={project.title}
              fill
              className="object-cover"
              sizes="32rem"
              priority
            />
            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-sm bg-surface/90 px-2 py-1 text-small font-medium text-ink shadow-sm"
                  aria-label="Previous image"
                  onClick={() =>
                    setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                  }
                >
                  ←
                </button>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm bg-surface/90 px-2 py-1 text-small font-medium text-ink shadow-sm"
                  aria-label="Next image"
                  onClick={() => setImageIndex((prev) => (prev + 1) % images.length)}
                >
                  →
                </button>
              </>
            ) : null}
          </div>
          {images.length > 1 ? (
            <div className="flex gap-2 overflow-x-auto border-b border-border px-6 py-3 scrollbar-hide">
              {images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  className={cn(
                    "relative h-14 w-20 shrink-0 overflow-hidden rounded-sm border",
                    index === imageIndex ? "border-ink" : "border-border opacity-70",
                  )}
                  onClick={() => setImageIndex(index)}
                >
                  <Image src={src} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          ) : null}

          <div className="space-y-6 px-6 py-6">
            <section>
              <h3 className="text-small font-semibold uppercase tracking-[0.12em] text-muted">
                Overview
              </h3>
              <p className="mt-2 text-body leading-relaxed text-ink">{project.overview}</p>
            </section>
            <hr className="border-border" />
            <section>
              <h3 className="text-small font-semibold uppercase tracking-[0.12em] text-muted">
                Scope
              </h3>
              <ul className="mt-3 space-y-2 text-body text-ink">
                {project.scope.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>
            <hr className="border-border" />
            <section>
              <h3 className="text-small font-semibold uppercase tracking-[0.12em] text-muted">
                Execution
              </h3>
              <p className="mt-2 text-body leading-relaxed text-ink">{project.execution}</p>
            </section>
            <hr className="border-border" />
            <section>
              <h3 className="text-small font-semibold uppercase tracking-[0.12em] text-muted">
                Outcome
              </h3>
              <p className="mt-2 text-body leading-relaxed text-ink">{project.outcome}</p>
            </section>
            <hr className="border-border" />
            <section className="text-body">
              <p>
                <span className="text-muted">Location:</span>{" "}
                <span className="font-medium text-ink">{project.location}</span>
              </p>
              <p className="mt-2">
                <span className="text-muted">Service:</span>{" "}
                <Link href={serviceHref} className="font-medium text-ink underline underline-offset-2">
                  {project.serviceType}
                </Link>
              </p>
            </section>
          </div>
        </div>

        <footer className="shrink-0 border-t border-border bg-surface px-6 py-4">
          <div className="flex flex-col gap-2">
            <Link href={bookHref} className={buttonClassName("primary", "w-full justify-center")}>
              Book similar service
            </Link>
            <Link href={askHref} className={buttonClassName("secondary", "w-full justify-center")}>
              Ask about this project
            </Link>
          </div>
        </footer>
      </aside>
    </div>
  );
}
