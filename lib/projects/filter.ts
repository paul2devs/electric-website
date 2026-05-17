import type { ServiceCategoryId } from "@/lib/data/services";
import type { ProjectRecord } from "@/lib/data/projects";
import type { ServiceBrowseFilterId } from "@/lib/services/browse-filter";

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

export function filterProjectsByBrowseId(
  projects: readonly ProjectRecord[],
  filterId: ServiceBrowseFilterId,
): ProjectRecord[] {
  return projects.filter((project) => categoryMatchesFilter(project.categoryId, filterId));
}
