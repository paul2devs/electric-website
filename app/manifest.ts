import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/seo/site-metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Testimonydot",
    short_name: "Testimonydot",
    description:
      "Book professional electrical services — installations, repairs, smart systems, and solar.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a0a0a",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    id: siteUrl,
    lang: "en-NG",
    scope: "/",
  };
}
