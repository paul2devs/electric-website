import { routes } from "@/lib/constants/routes";
import { getServiceBySlug, type ServiceSlug } from "@/lib/data/services";

export const FOOTER_SERVICE_SLUGS = [
  "cctv-installation",
  "electrical-wiring",
  "smart-home-automation",
  "solar-installation",
] as const satisfies readonly ServiceSlug[];

export type FooterServiceLink = {
  label: string;
  href: string;
};

export function getFooterServiceLinks(): FooterServiceLink[] {
  return FOOTER_SERVICE_SLUGS.map((slug) => {
    const record = getServiceBySlug(slug);
    if (!record) {
      throw new Error(`Footer service missing: ${slug}`);
    }
    return {
      label: record.name,
      href: routes.serviceDetail(slug),
    };
  });
}
