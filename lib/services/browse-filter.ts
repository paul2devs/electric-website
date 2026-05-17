import type { ServiceCategoryId, ServiceRecord } from "@/lib/data/services";

export type ServiceBrowseFilterId =
  | "all"
  | "installations"
  | "repairs"
  | "smart-systems"
  | "solar"
  | "general";

export type ServiceBrowseFilter = {
  id: ServiceBrowseFilterId;
  label: string;
};

export const SERVICE_BROWSE_FILTERS: readonly ServiceBrowseFilter[] = [
  { id: "all", label: "All" },
  { id: "installations", label: "Installations" },
  { id: "repairs", label: "Repairs" },
  { id: "smart-systems", label: "Smart Systems" },
  { id: "solar", label: "Solar" },
  { id: "general", label: "General" },
] as const;

function categoryMatchesFilter(
  categoryId: ServiceCategoryId,
  filterId: ServiceBrowseFilterId,
): boolean {
  if (filterId === "all") {
    return true;
  }
  if (filterId === "installations") {
    return categoryId === "installation";
  }
  if (filterId === "repairs") {
    return categoryId === "repairs";
  }
  if (filterId === "smart-systems") {
    return categoryId === "smart-systems";
  }
  if (filterId === "solar") {
    return categoryId === "solar";
  }
  if (filterId === "general") {
    return categoryId === "maintenance" || categoryId === "inspection";
  }
  return false;
}

export function filterServicesByBrowseId(
  services: readonly ServiceRecord[],
  filterId: ServiceBrowseFilterId,
): ServiceRecord[] {
  return services.filter((service) => categoryMatchesFilter(service.categoryId, filterId));
}
