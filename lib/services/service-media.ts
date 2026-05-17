import type { BackendService } from "@/lib/bookings/types";
import { getServiceBySlug } from "@/lib/data/services";

import { catalogSlugForServiceName, normalizeServiceSlug } from "./service-catalog-map";

export const DEFAULT_SERVICE_IMAGE = "/services/default.svg" as const;

export function getCatalogImagePath(slug: string, imageUrl?: string | null): string {
  if (imageUrl?.trim()) {
    const trimmed = imageUrl.trim();
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  }
  return `/services/${slug}.svg`;
}

export function resolveSlugForService(input: {
  slug?: string | null;
  name: string;
}): string {
  if (input.slug?.trim()) {
    return input.slug.trim();
  }
  const fromName = catalogSlugForServiceName(input.name);
  if (fromName) {
    return fromName;
  }
  return normalizeServiceSlug(input.name);
}

export function resolveServiceImage(input: {
  slug?: string | null;
  name: string;
  imageUrl?: string | null;
}): string {
  const slug = resolveSlugForService(input);
  const catalog = getServiceBySlug(slug);
  const imageUrl = input.imageUrl ?? catalog?.imageUrl ?? null;
  return getCatalogImagePath(slug, imageUrl);
}

export type EnrichedBackendService = BackendService & {
  slug: string;
  imageUrl: string;
};

export function enrichBackendService(service: BackendService): EnrichedBackendService {
  const slug = resolveSlugForService({
    slug: service.slug,
    name: service.name,
  });
  const imageUrl = resolveServiceImage({
    slug,
    name: service.name,
    imageUrl: service.imageUrl,
  });
  return { ...service, slug, imageUrl };
}

export function enrichBackendServices(services: BackendService[]): EnrichedBackendService[] {
  return services.map(enrichBackendService);
}
