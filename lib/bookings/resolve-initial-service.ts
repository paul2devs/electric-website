import type { BackendService } from "@/lib/bookings/types";
import { SERVICES } from "@/lib/data/services";
import {
  catalogNameForSlug,
  catalogSlugForServiceName,
  normalizeServiceSlug,
} from "@/lib/services/service-catalog-map";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string | undefined): value is string {
  return Boolean(value && uuidPattern.test(value));
}

function findApiServiceBySlug(apiServices: BackendService[], slug: string): BackendService | undefined {
  const normalized = normalizeServiceSlug(slug);
  const direct = apiServices.find((item) => item.slug && normalizeServiceSlug(item.slug) === normalized);
  if (direct) {
    return direct;
  }
  const catalogName = catalogNameForSlug(normalized);
  if (catalogName) {
    const byName = apiServices.find(
      (item) => item.name.trim().toLowerCase() === catalogName.toLowerCase(),
    );
    if (byName) {
      return byName;
    }
  }
  const staticMatch = SERVICES.find((item) => item.slug === normalized);
  if (!staticMatch) {
    return undefined;
  }
  return apiServices.find(
    (item) => item.name.trim().toLowerCase() === staticMatch.name.toLowerCase(),
  );
}

export function resolveInitialServiceId(
  param: string | undefined,
  apiServices: BackendService[],
): string | undefined {
  if (!param?.trim()) {
    return undefined;
  }
  const trimmed = param.trim();

  if (isUuid(trimmed)) {
    return apiServices.some((item) => item.id === trimmed) ? trimmed : undefined;
  }

  const bySlug = findApiServiceBySlug(apiServices, trimmed);
  if (bySlug) {
    return bySlug.id;
  }

  const staticMatch = SERVICES.find(
    (item) => item.slug === trimmed || normalizeServiceSlug(item.slug) === normalizeServiceSlug(trimmed),
  );
  if (staticMatch) {
    const byName = apiServices.find(
      (item) => item.name.trim().toLowerCase() === staticMatch.name.toLowerCase(),
    );
    return byName?.id;
  }

  const slugFromName = catalogSlugForServiceName(trimmed);
  if (slugFromName) {
    const resolved = findApiServiceBySlug(apiServices, slugFromName);
    return resolved?.id;
  }

  return undefined;
}
