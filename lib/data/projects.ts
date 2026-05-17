import type { ServiceCategoryId } from "@/lib/data/services";
import type { ServiceSlug } from "@/lib/data/services";

export type ProjectRecord = {
  slug: string;
  title: string;
  subtitle: string;
  location: string;
  serviceType: string;
  relatedServiceSlug: ServiceSlug;
  categoryId: ServiceCategoryId;
  shortDescription: string;
  overview: string;
  scope: readonly string[];
  execution: string;
  outcome: string;
  coverImage: string;
  images: readonly string[];
  beforeImage?: string;
  afterImage?: string;
};

export const FEATURED_PROJECT_SLUG = "luxury-cctv-lekki" as const;

export const PROJECTS: readonly ProjectRecord[] = [
  {
    slug: "luxury-cctv-lekki",
    title: "Luxury CCTV Installation — Lekki",
    subtitle: "Residential security system setup",
    location: "Lekki, Lagos",
    serviceType: "CCTV Installation",
    relatedServiceSlug: "cctv-installation",
    categoryId: "smart-systems",
    shortDescription:
      "Full-property surveillance with structured camera placement, clean wiring, and remote monitoring.",
    overview:
      "Full-property CCTV installation across a residential building, ensuring complete coverage and remote monitoring capability.",
    scope: [
      "5-zone camera setup",
      "Structured cable routing",
      "External and internal coverage",
    ],
    execution:
      "Carefully planned camera placement with concealed wiring to maintain clean aesthetics while ensuring full visibility coverage.",
    outcome:
      "Complete surveillance system with remote access, clear video coverage, and long-term reliability.",
    coverImage: "/projects/cctv-lekki-cover.svg",
    images: [
      "/projects/cctv-lekki-cover.svg",
      "/projects/cctv-lekki-2.svg",
      "/projects/cctv-lekki-3.svg",
    ],
    beforeImage: "/projects/cctv-before.svg",
    afterImage: "/projects/cctv-after.svg",
  },
  {
    slug: "commercial-solar-victoria-island",
    title: "Commercial Solar Array — Victoria Island",
    subtitle: "Rooftop grid-tied installation",
    location: "Victoria Island, Lagos",
    serviceType: "Solar Installation",
    relatedServiceSlug: "solar-installation",
    categoryId: "solar",
    shortDescription:
      "Office rooftop solar with inverter commissioning and production monitoring from day one.",
    overview:
      "Grid-tied solar deployment for a multi-floor commercial property with structured DC routing and monitoring handover.",
    scope: [
      "Shading and structural review",
      "Module and inverter installation",
      "Protection and earthing checks",
    ],
    execution:
      "Phased install across roof zones with labelled DC runs and inverter room build-out to facility standards.",
    outcome:
      "Stable daytime production with live monitoring and documented startup for facilities staff.",
    coverImage: "/projects/solar-vi-cover.svg",
    images: ["/projects/solar-vi-cover.svg", "/projects/solar-vi-2.svg"],
    beforeImage: "/projects/solar-before.svg",
    afterImage: "/projects/solar-after.svg",
  },
  {
    slug: "office-wiring-ikeja",
    title: "Office Wiring Programme — Ikeja",
    subtitle: "Commercial distribution upgrade",
    location: "Ikeja, Lagos",
    serviceType: "Electrical Wiring",
    relatedServiceSlug: "electrical-wiring",
    categoryId: "installation",
    shortDescription:
      "Structured wiring rollout for open-plan offices with labelled boards and tested circuits.",
    overview:
      "Multi-circuit wiring programme for a growing office floorplate with capacity for future load growth.",
    scope: [
      "Load schedule and circuit design",
      "Containment and cabling",
      "Testing and energisation",
    ],
    execution:
      "Night-window installs to limit downtime, with phased energisation and clear circuit labelling at boards.",
    outcome:
      "Stable distribution with documented test results and as-built circuit schedule for the client.",
    coverImage: "/projects/wiring-ikeja-cover.svg",
    images: ["/projects/wiring-ikeja-cover.svg"],
  },
  {
    slug: "smart-home-lekki-phase-1",
    title: "Smart Home Automation — Lekki Phase 1",
    subtitle: "Lighting and scene control",
    location: "Lekki, Lagos",
    serviceType: "Smart Home Automation",
    relatedServiceSlug: "smart-home-automation",
    categoryId: "smart-systems",
    shortDescription:
      "Zone-based lighting scenes with reliable switches and owner training.",
    overview:
      "Automation layer for lighting and comfort zones with predictable manual overrides.",
    scope: [
      "Device pairing and VLAN basics",
      "Scene programming",
      "Owner handover session",
    ],
    execution:
      "Installed and commissioned switches and sensors per room map, with scenes tuned for daily use.",
    outcome:
      "Reliable schedules and manual control without fragile Wi-Fi-only dependencies.",
    coverImage: "/projects/smart-lekki-cover.svg",
    images: ["/projects/smart-lekki-cover.svg"],
  },
  {
    slug: "consumer-unit-surulere",
    title: "Consumer Unit Upgrade — Surulere",
    subtitle: "Board replacement and labelling",
    location: "Surulere, Lagos",
    serviceType: "Consumer Unit Upgrade",
    relatedServiceSlug: "consumer-unit-upgrade",
    categoryId: "installation",
    shortDescription:
      "Modern protection board with coordinated breakers and clear circuit identification.",
    overview:
      "Replacement of aged distribution board with coordinated protection and improved earthing checks.",
    scope: [
      "Circuit identification",
      "New board and breakers",
      "Insulation and RCD tests",
    ],
    execution:
      "Controlled shutdown, re-termination, and labelling with post-install test pack for the homeowner.",
    outcome:
      "Safer protection layout with faster fault isolation and readable labels for future maintenance.",
    coverImage: "/projects/consumer-surulere.svg",
    images: ["/projects/consumer-surulere.svg"],
  },
  {
    slug: "emergency-restoration-yaba",
    title: "Emergency Restoration — Yaba",
    subtitle: "Fault isolation and reinstatement",
    location: "Yaba, Lagos",
    serviceType: "General Repairs",
    relatedServiceSlug: "general-repairs",
    categoryId: "repairs",
    shortDescription:
      "Same-day fault tracing and safe reinstatement after partial power loss.",
    overview:
      "Emergency attendance for intermittent power loss traced to damaged accessories and loose terminations.",
    scope: [
      "Isolation and safe working",
      "Accessory replacement",
      "Post-repair testing",
    ],
    execution:
      "Systematic fault tracing on affected circuits with replacement of failed accessories and torque checks.",
    outcome:
      "Full reinstatement with written follow-up actions for any latent issues found during inspection.",
    coverImage: "/projects/emergency-yaba.svg",
    images: ["/projects/emergency-yaba.svg"],
  },
  {
    slug: "structured-cabling-ajah",
    title: "Structured Cabling — Ajah Campus",
    subtitle: "Copper backbone and patch frames",
    location: "Ajah, Lagos",
    serviceType: "Structured Data Cabling",
    relatedServiceSlug: "structured-data-cabling",
    categoryId: "smart-systems",
    shortDescription:
      "Certified copper runs with Fluke exports and labelled patch frames.",
    overview:
      "Campus cabling backbone linking floors to central patch rooms with test documentation.",
    scope: [
      "Cable schedules",
      "Patch frame termination",
      "Certification exports",
    ],
    execution:
      "Installed containment and runs to drawing, with sequential testing and as-built updates.",
    outcome:
      "Audit-ready cabling plant with labelled ports and handed-over test results.",
    coverImage: "/projects/cabling-ajah.svg",
    images: ["/projects/cabling-ajah.svg"],
  },
  {
    slug: "battery-storage-ikoyi",
    title: "Battery Storage Integration — Ikoyi",
    subtitle: "Hybrid inverter coupling",
    location: "Ikoyi, Lagos",
    serviceType: "Battery Storage Integration",
    relatedServiceSlug: "solar-battery-storage",
    categoryId: "solar",
    shortDescription:
      "AC-coupled storage with safe shutdowns and monitoring for state of health.",
    overview:
      "Battery integration with existing solar plant for extended backup hours and monitored charge limits.",
    scope: [
      "Protection review",
      "Battery and inverter integration",
      "Operating mode training",
    ],
    execution:
      "Commissioned charge and discharge limits with shutdown interlocks verified under load.",
    outcome:
      "Predictable backup windows with visible state-of-health data for the estate team.",
    coverImage: "/projects/battery-ikoyi.svg",
    images: ["/projects/battery-ikoyi.svg"],
  },
] as const;

export type ProjectSlug = (typeof PROJECTS)[number]["slug"];

export function getProjectBySlug(slug: string): ProjectRecord | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

export function getFeaturedProject(): ProjectRecord {
  const record = getProjectBySlug(FEATURED_PROJECT_SLUG);
  if (!record) {
    throw new Error("Featured project is not defined in PROJECTS");
  }
  return record;
}

export function getGridProjects(): readonly ProjectRecord[] {
  return PROJECTS.filter((project) => project.slug !== FEATURED_PROJECT_SLUG);
}

export function getProjectsWithBeforeAfter(): readonly ProjectRecord[] {
  return PROJECTS.filter((project) => project.beforeImage && project.afterImage);
}
