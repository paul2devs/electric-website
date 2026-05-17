import type { Metadata } from "next";

import { ContactPageExperience } from "@/components/contact/contact-page-experience";
import { buildPageMetadata } from "@/lib/seo/site-metadata";
import { getProjectBySlug } from "@/lib/data/projects";
import { getServiceBySlug } from "@/lib/data/services";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description: "Reach Testimonydot operations by phone, email, or structured enquiry form.",
  path: "/contact",
});

type ContactPageProps = {
  searchParams: Promise<{
    intent?: string;
    service?: string;
    topic?: string;
    project?: string;
  }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const topic = typeof params.topic === "string" ? params.topic : undefined;
  const service =
    typeof params.service === "string" ? getServiceBySlug(params.service) : undefined;
  const project =
    typeof params.project === "string" ? getProjectBySlug(params.project) : undefined;

  const topicHelp =
    topic === "service" || topic === "choose-service"
      ? "You asked for help choosing a service — describe the site, timelines, and constraints so we can recommend the right programme."
      : topic === "question"
        ? "You opened this thread from a service detail — mention the service name and location so we can route you to the right specialist."
        : topic === "project" && project
          ? `You are asking about ${project.title}. Share timing, access constraints, or how closely you want to match this scope.`
          : null;

  const contactInitialMessage =
    topic === "project" && project
      ? `I'd like to ask about the ${project.title} project (${project.location}).`
      : undefined;

  return (
    <ContactPageExperience
      topicHelp={topicHelp}
      serviceName={service?.name ?? project?.serviceType}
      initialMessage={contactInitialMessage}
      initialServiceSlug={service?.slug ?? project?.relatedServiceSlug}
    />
  );
}
