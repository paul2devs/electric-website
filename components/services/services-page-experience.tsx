"use client";

import { useMemo } from "react";

import { Container } from "@/components/layout/container";
import { useServicesBrowse } from "@/hooks/use-services-browse";
import type { ServiceRecord } from "@/lib/data/services";
import { getServiceBySlug } from "@/lib/data/services";

import { ServiceDetailsPanel } from "./service-details-panel";
import { ServiceFeaturedSpotlight } from "./service-featured-spotlight";
import { ServiceFilterNav } from "./service-filter-nav";
import { ServicePageFinalCta } from "./service-page-final-cta";
import { ServicePageHero } from "./service-page-hero";
import { ServicePricingSection } from "./service-pricing-section";
import { ServicesMinimalGrid } from "./services-minimal-grid";

type ServicesPageExperienceProps = {
  featured: ServiceRecord;
  gridServices: readonly ServiceRecord[];
  featuredImageSrc: string;
};

export function ServicesPageExperience({
  featured,
  gridServices,
  featuredImageSrc,
}: ServicesPageExperienceProps) {
  const {
    filterId,
    changeFilter,
    filteredServices,
    gridOpacity,
    detailSlug,
    openDetail,
    closeDetail,
  } = useServicesBrowse(gridServices);

  const detailService = useMemo(
    () => (detailSlug ? getServiceBySlug(detailSlug) ?? null : null),
    [detailSlug],
  );

  return (
    <>
      <ServicePageHero />
      <div
        id="services-catalogue"
        className="sticky top-[4.25rem] z-30 border-b border-border/80 sm:top-[4.5rem]"
      >
        <ServiceFilterNav value={filterId} onChange={changeFilter} />
      </div>
      <ServiceFeaturedSpotlight service={featured} imageSrc={featuredImageSrc} />
      <section className="border-b border-border bg-surface">
        <Container className="px-8 py-16 sm:px-10 sm:py-20 lg:px-12 lg:py-24">
          <div className="mb-10 max-w-xl">
            <h2 className="text-subtitle font-semibold tracking-tight text-ink">All programmes</h2>
            <p className="mt-2 text-body text-muted">
              Typography-first catalogue — select a row to review scope, or open details without
              leaving the page.
            </p>
          </div>
          <ServicesMinimalGrid
            services={filteredServices}
            gridOpacity={gridOpacity}
            onOpenDetail={openDetail}
          />
        </Container>
      </section>
      <ServicePricingSection />
      <ServicePageFinalCta />
      <ServiceDetailsPanel
        service={detailService}
        open={detailSlug !== null && detailService !== null}
        onClose={closeDetail}
      />
    </>
  );
}
