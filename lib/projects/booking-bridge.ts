import { routes } from "@/lib/constants/routes";
import type { ProjectRecord } from "@/lib/data/projects";

export function buildProjectBookingMessage(project: ProjectRecord): string {
  return `I'd like a similar setup to the ${project.title} project.`;
}

export function buildBookFromProjectHref(project: ProjectRecord): string {
  const params = new URLSearchParams();
  params.set("serviceId", project.relatedServiceSlug);
  params.set("project", project.slug);
  params.set("inspired", project.title);
  return `${routes.book}?${params.toString()}`;
}

export function buildAskAboutProjectHref(project: ProjectRecord): string {
  const params = new URLSearchParams();
  params.set("topic", "project");
  params.set("project", project.slug);
  params.set("service", project.relatedServiceSlug);
  return `${routes.contact}?${params.toString()}`;
}
