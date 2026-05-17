"use client";

import { ServiceImage } from "@/components/ui/service-image";
import { routes } from "@/lib/constants/routes";
import type { ServiceRecord } from "@/lib/data/services";
import { getServiceImageForRecord } from "@/lib/data/services";
import { cn } from "@/lib/utils";

type ServicesMinimalGridProps = {
  services: readonly ServiceRecord[];
  gridOpacity: number;
  onOpenDetail: (slug: string) => void;
};

export function ServicesMinimalGrid({
  services,
  gridOpacity,
  onOpenDetail,
}: ServicesMinimalGridProps) {
  return (
    <div className="transition-opacity duration-200 ease-out" style={{ opacity: gridOpacity }}>
      <div className="grid gap-10 sm:grid-cols-2 sm:gap-x-10 lg:gap-x-12">
        {services.map((service) => (
          <ServiceMinimalItem key={service.slug} service={service} onOpenDetail={onOpenDetail} />
        ))}
      </div>
      {services.length === 0 ? (
        <p className="mt-8 text-body text-muted">No services in this category yet.</p>
      ) : null}
    </div>
  );
}

type ServiceMinimalItemProps = {
  service: ServiceRecord;
  onOpenDetail: (slug: string) => void;
};

function ServiceMinimalItem({ service, onOpenDetail }: ServiceMinimalItemProps) {
  return (
    <article className="group relative border-b border-border pb-10 sm:min-h-[11rem] sm:border-0 sm:pb-0">
      <div
        className={cn(
          "relative rounded-sm pl-0 transition-colors duration-200 sm:pl-4",
          "before:pointer-events-none before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-ink before:opacity-0 before:transition-opacity before:duration-200",
          "group-hover:bg-hover/40 sm:group-hover:before:opacity-100",
        )}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4 sm:pr-2">
          <ServiceImage
            src={getServiceImageForRecord(service)}
            alt={service.name}
            className="aspect-[16/10] w-full shrink-0 rounded-sm sm:h-24 sm:w-32 sm:aspect-auto"
            sizes="(max-width: 640px) 100vw, 128px"
          />
          <div className="min-w-0 flex-1">
          <a
            href={routes.serviceDetail(service.slug)}
            className="text-subtitle font-semibold tracking-tight text-ink transition-colors group-hover:text-ink"
            onClick={(event) => {
              event.preventDefault();
              onOpenDetail(service.slug);
            }}
          >
            {service.name}
          </a>
          <p className="text-body leading-relaxed text-muted">{service.shortDescription}</p>
          <button
            type="button"
            className="flex w-fit items-center gap-1 text-small font-medium text-muted transition-[color,transform] duration-200 group-hover:text-ink group-hover:[&>span:last-child]:translate-x-0.5"
            onClick={() => onOpenDetail(service.slug)}
          >
            <span>View details</span>
            <span aria-hidden>→</span>
          </button>
          </div>
        </div>
      </div>
    </article>
  );
}
