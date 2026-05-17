import { routes } from "@/lib/constants/routes";

export function bookContactHref(serviceIdOrSlug?: string): string {
  const params = new URLSearchParams();
  if (serviceIdOrSlug) {
    params.set("serviceId", serviceIdOrSlug);
  }
  const query = params.toString();
  return query.length > 0 ? `${routes.book}?${query}` : routes.book;
}
