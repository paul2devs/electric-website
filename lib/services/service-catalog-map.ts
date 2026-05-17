import { SERVICES } from "@/lib/data/services";

const slugByName = new Map(SERVICES.map((service) => [service.name.toLowerCase(), service.slug]));

const nameBySlug = new Map(SERVICES.map((service) => [service.slug, service.name]));

export function catalogSlugForServiceName(name: string): string | undefined {
  return slugByName.get(name.trim().toLowerCase());
}

export function catalogNameForSlug(slug: string): string | undefined {
  return nameBySlug.get(slug);
}

export function normalizeServiceSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
