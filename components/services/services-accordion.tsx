"use client";

import { useAccordionGroup } from "@/hooks/use-accordion-group";
import type { ServiceRecord } from "@/lib/data/services";

import { ServiceRow } from "./service-row";

type ServicesAccordionProps = {
  services: readonly ServiceRecord[];
};

export function ServicesAccordion({ services }: ServicesAccordionProps) {
  const { isSlugOpen, toggle } = useAccordionGroup();

  if (services.length === 0) {
    return (
      <p className="text-body text-muted">
        No services match this category.
      </p>
    );
  }

  return (
    <div className="min-w-0 flex-1 border-t border-border">
      {services.map((service) => (
        <ServiceRow
          key={service.slug}
          isOpen={isSlugOpen(service.slug)}
          service={service}
          onToggle={toggle}
        />
      ))}
    </div>
  );
}
