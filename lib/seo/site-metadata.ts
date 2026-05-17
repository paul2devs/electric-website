import type { Metadata } from "next";

import { getPublicAppOrigin } from "@/lib/constants/app-origin";

const siteName = "Testimonydot";

export const siteUrl = getPublicAppOrigin();

export const defaultOgImagePath = "/og-preview.svg";

export const defaultDescription =
  "Professional electrical services in Nigeria — structured booking, transparent pricing, and licensed crews for installations, repairs, smart systems, and solar.";

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildPageMetadata(input: {
  title: string;
  description?: string;
  path?: string;
  imagePath?: string;
  noIndex?: boolean;
}): Metadata {
  const description = input.description ?? defaultDescription;
  const canonical = input.path ? absoluteUrl(input.path) : siteUrl;
  const image = absoluteUrl(input.imagePath ?? defaultOgImagePath);

  return {
    title: input.title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "en_NG",
      url: canonical,
      siteName,
      title: `${input.title} · ${siteName}`,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${input.title} · ${siteName}`,
      description,
      images: [image],
    },
    robots: input.noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Electrician",
  name: siteName,
  url: siteUrl,
  description: defaultDescription,
  areaServed: {
    "@type": "City",
    name: "Lagos",
  },
  serviceType: [
    "Electrical installation",
    "Electrical repair",
    "CCTV installation",
    "Solar installation",
    "Smart home automation",
  ],
} as const;
