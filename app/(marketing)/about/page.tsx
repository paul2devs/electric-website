import type { Metadata } from "next";

import { AboutPageExperience } from "@/components/about/about-page-experience";
import { buildPageMetadata } from "@/lib/seo/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description:
    "Structured electrical services for Nigerian residential and commercial properties.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutPageExperience />;
}
