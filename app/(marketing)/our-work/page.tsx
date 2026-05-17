import type { Metadata } from "next";

import { OurWorkPageExperience } from "@/components/work/our-work-page-experience";
import { buildPageMetadata } from "@/lib/seo/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Our work",
  description:
    "Completed electrical projects across Lagos — installations, repairs, smart systems, and solar.",
  path: "/our-work",
});

export default function OurWorkPage() {
  return <OurWorkPageExperience />;
}
