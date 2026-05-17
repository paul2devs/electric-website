import type { Metadata } from "next";

import {
  LANDING_FEATURED_SERVICE_SLUG,
  SERVICES,
  getLandingFeaturedService,
  getServiceImageForRecord,
} from "@/lib/data/services";
import { buildPageMetadata } from "@/lib/seo/site-metadata";

import { ServicesPageExperience } from "@/components/services/services-page-experience";

export const metadata: Metadata = buildPageMetadata({
  title: "Services",
  description:
    "Browse structured electrical services — installations, repairs, smart systems, solar, and maintenance.",
  path: "/services",
});

export default function ServicesPage() {
  const featured = getLandingFeaturedService();
  const gridServices = SERVICES.filter((service) => service.slug !== LANDING_FEATURED_SERVICE_SLUG);

  return (
    <ServicesPageExperience
      featured={featured}
      gridServices={gridServices}
      featuredImageSrc={getServiceImageForRecord(featured)}
    />
  );
}
