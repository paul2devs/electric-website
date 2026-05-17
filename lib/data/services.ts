import { routes } from "@/lib/constants/routes";

export type ServiceCategoryId =
  | "installation"
  | "maintenance"
  | "repairs"
  | "inspection"
  | "smart-systems"
  | "solar";

export type ServiceCategory = {
  id: ServiceCategoryId;
  label: string;
};

export const SERVICE_CATEGORIES: readonly ServiceCategory[] = [
  { id: "installation", label: "Installation" },
  { id: "maintenance", label: "Maintenance" },
  { id: "repairs", label: "Repairs" },
  { id: "inspection", label: "Inspection" },
  { id: "smart-systems", label: "Smart Systems" },
  { id: "solar", label: "Solar" },
] as const;

export type ServiceAddon = {
  name: string;
  description: string;
  startingPriceNgn: number;
};

export type ServiceRecord = {
  slug: string;
  imageUrl?: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  duration: string;
  startingPriceNgn: number;
  categoryId: ServiceCategoryId;
  whatsIncluded: readonly string[];
  relatedSlugs: readonly string[];
  addOns: readonly ServiceAddon[];
};

export const SERVICES: readonly ServiceRecord[] = [
  {
    slug: "cctv-installation",
    name: "CCTV Installation",
    shortDescription:
      "Discreet camera coverage with clean cable routing and recorder setup.",
    fullDescription:
      "We design camera placement for corridors, perimeters, and entry points, run structured cabling to a central recorder, and commission mobile viewing so your team can monitor sites without guesswork.",
    duration: "Half day to two days, depending on camera count",
    startingPriceNgn: 285000,
    categoryId: "smart-systems",
    whatsIncluded: [
      "Site walkthrough and mounting plan",
      "Power and data runs to specification",
      "Recorder configuration and handover checklist",
    ],
    relatedSlugs: ["access-control-systems", "structured-data-cabling"],
    addOns: [
      {
        name: "Remote monitoring setup",
        description: "Secure remote access with hardened credentials and alerts.",
        startingPriceNgn: 65000,
      },
      {
        name: "After-hours commissioning",
        description: "Work completed outside standard business hours.",
        startingPriceNgn: 45000,
      },
    ],
  },
  {
    slug: "electrical-wiring",
    name: "Electrical Wiring",
    shortDescription:
      "Distribution, circuits, and earthing for new builds and major remodels.",
    fullDescription:
      "From mains intake to final circuits, we install cabling, protection, and earthing to Nigerian Electrical Code practice, with labelled boards and as-built documentation for facilities teams.",
    duration: "Multi-day, scoped to floorplate and load schedule",
    startingPriceNgn: 485000,
    categoryId: "installation",
    whatsIncluded: [
      "Load assessment and circuit schedule",
      "Cabling, containment, and accessories",
      "Testing, energisation, and sign-off pack",
    ],
    relatedSlugs: [
      "consumer-unit-upgrade",
      "lighting-installation-programmes",
      "periodic-inspection",
    ],
    addOns: [
      {
        name: "Dedicated circuits for HVAC or kitchen loads",
        description: "Isolated breakers and sizing for heavy equipment.",
        startingPriceNgn: 95000,
      },
    ],
  },
  {
    slug: "solar-installation",
    name: "Solar Installation",
    shortDescription:
      "Roof or canopy arrays paired with inverters for dependable daytime power.",
    fullDescription:
      "We mount modules, route DC safely, install grid-tied or hybrid inverters, and commission monitoring so production data is visible from day one.",
    duration: "Two to five days for typical commercial rooftops",
    startingPriceNgn: 1850000,
    categoryId: "solar",
    whatsIncluded: [
      "Structural and shading review",
      "Module, inverter, and protection hardware",
      "Startup tests and customer training",
    ],
    relatedSlugs: ["solar-battery-storage", "consumer-unit-upgrade"],
    addOns: [
      {
        name: "Battery storage add-on",
        description: "Expand with storage when you are ready for backup hours.",
        startingPriceNgn: 890000,
      },
    ],
  },
  {
    slug: "smart-home-automation",
    name: "Smart Home Automation",
    shortDescription:
      "Scenes, sensors, and reliable control for lighting and comfort.",
    fullDescription:
      "We integrate switches, sensors, and hubs so schedules, occupancy, and manual overrides behave predictably—without fragile Wi-Fi-only shortcuts.",
    duration: "One to three days depending on zones",
    startingPriceNgn: 320000,
    categoryId: "smart-systems",
    whatsIncluded: [
      "Control architecture and device pairing",
      "Scene programming and owner training",
      "Network hardening basics for device VLANs",
    ],
    relatedSlugs: ["structured-data-cabling", "lighting-installation-programmes"],
    addOns: [
      {
        name: "Guest and staff access profiles",
        description: "Separate permission tiers for household or facility staff.",
        startingPriceNgn: 55000,
      },
    ],
  },
  {
    slug: "general-repairs",
    name: "General Repairs",
    shortDescription:
      "Fault tracing, replacements, and safe restoration of failed circuits.",
    fullDescription:
      "We isolate faults, replace damaged accessories, and restore power with documented tests so the same issue does not return on the next rainy season.",
    duration: "Typically two to six hours on site",
    startingPriceNgn: 48000,
    categoryId: "repairs",
    whatsIncluded: [
      "Isolation and safe working procedures",
      "Replacement accessories as agreed",
      "Post-repair insulation and continuity tests",
    ],
    relatedSlugs: ["emergency-call-out", "periodic-inspection"],
    addOns: [
      {
        name: "Extended labour block",
        description: "Additional on-site time for multi-point faults.",
        startingPriceNgn: 35000,
      },
    ],
  },
  {
    slug: "consumer-unit-upgrade",
    name: "Consumer Unit Upgrade",
    shortDescription:
      "Modern protection, neat terminations, and clear circuit identification.",
    fullDescription:
      "We replace aged boards with correctly coordinated breakers and RCDs, re-terminate circuits, and label everything for faster maintenance later.",
    duration: "One day for most residential and small commercial boards",
    startingPriceNgn: 195000,
    categoryId: "installation",
    whatsIncluded: [
      "Existing circuit identification",
      "New board, breakers, and earthing checks",
      "Testing certificate pack",
    ],
    relatedSlugs: ["electrical-wiring", "periodic-inspection"],
    addOns: [
      {
        name: "Surge protection device",
        description: "Type-2 SPD fitted at origin where appropriate.",
        startingPriceNgn: 72000,
      },
    ],
  },
  {
    slug: "lighting-installation-programmes",
    name: "Lighting Installation Programmes",
    shortDescription:
      "Rollouts for offices and retail with consistent colour temperature and controls.",
    fullDescription:
      "We execute phased installs across floors, maintain emergency routes first, and align drivers and controls to your facilities standard.",
    duration: "Phased; typical bays complete overnight windows",
    startingPriceNgn: 265000,
    categoryId: "installation",
    whatsIncluded: [
      "Fixtures, drivers, and containment as designed",
      "Circuit balancing and dimming checks",
      "Snag list closure with photos",
    ],
    relatedSlugs: ["electrical-wiring", "smart-home-automation"],
    addOns: [],
  },
  {
    slug: "preventive-maintenance-contracts",
    name: "Preventive Maintenance Contracts",
    shortDescription:
      "Scheduled thermal checks, torque reviews, and outage windows.",
    fullDescription:
      "Quarterly or bi-annual visits keep distribution equipment within temperature norms and catch loose terminations before they arc.",
    duration: "Recurring half-day visits per site",
    startingPriceNgn: 145000,
    categoryId: "maintenance",
    whatsIncluded: [
      "Visit plan aligned to your operations calendar",
      "Thermal spot checks and tightening where safe",
      "Written observations and recommendations",
    ],
    relatedSlugs: ["generator-servicing", "periodic-inspection"],
    addOns: [
      {
        name: "Spares holding on site",
        description: "Stock common breakers and accessories for faster swaps.",
        startingPriceNgn: 120000,
      },
    ],
  },
  {
    slug: "generator-servicing",
    name: "Generator & Transfer Switch Servicing",
    shortDescription:
      "Exercise logs, fluid checks, and transfer tests under load.",
    fullDescription:
      "We service sets to manufacturer intervals, exercise transfer equipment, and record readings so estates teams have audit-friendly history.",
    duration: "Half day per unit for standard service",
    startingPriceNgn: 88000,
    categoryId: "maintenance",
    whatsIncluded: [
      "Fluids, filters, and belts as required",
      "Battery and starter checks",
      "Transfer test with building consent",
    ],
    relatedSlugs: ["preventive-maintenance-contracts", "emergency-call-out"],
    addOns: [],
  },
  {
    slug: "emergency-call-out",
    name: "Emergency Call-Out",
    shortDescription:
      "Rapid attendance for loss of power, overheating accessories, or safety risks.",
    fullDescription:
      "Our duty team isolates hazards first, then restores safe power or implements controlled shutdowns until permanent repairs are scheduled.",
    duration: "Response window agreed per contract; on-site same session",
    startingPriceNgn: 75000,
    categoryId: "repairs",
    whatsIncluded: [
      "Triage call and safe isolation",
      "Temporary reinstatement where possible",
      "Written follow-up actions",
    ],
    relatedSlugs: ["general-repairs", "consumer-unit-upgrade"],
    addOns: [
      {
        name: "Night or weekend attendance",
        description: "Premium window pricing for urgent attendance.",
        startingPriceNgn: 40000,
      },
    ],
  },
  {
    slug: "periodic-inspection",
    name: "Electrical Safety Inspection",
    shortDescription:
      "Formal periodic inspection with observations and classification codes.",
    fullDescription:
      "We inspect installations against applicable standards, classify findings, and provide a clear remediation priority list for your maintenance budget.",
    duration: "One day for mid-size facilities",
    startingPriceNgn: 165000,
    categoryId: "inspection",
    whatsIncluded: [
      "Visual and test sampling plan",
      "Observation schedule with codes",
      "Executive summary for leadership",
    ],
    relatedSlugs: ["pre-purchase-assessment", "electrical-wiring"],
    addOns: [],
  },
  {
    slug: "pre-purchase-assessment",
    name: "Pre-Purchase Property Assessment",
    shortDescription:
      "Electrical condition snapshot before you close on an asset.",
    fullDescription:
      "Targeted inspection and testing highlights latent costs in distribution, earthing, and compliance so acquisitions bake in realistic capex.",
    duration: "Half day plus reporting",
    startingPriceNgn: 125000,
    categoryId: "inspection",
    whatsIncluded: [
      "Board and earthing review",
      "Sample testing on representative circuits",
      "Budget-grade remediation estimate",
    ],
    relatedSlugs: ["periodic-inspection", "electrical-wiring"],
    addOns: [],
  },
  {
    slug: "access-control-systems",
    name: "Access Control Systems",
    shortDescription:
      "Card, PIN, and biometric readers integrated with door hardware.",
    fullDescription:
      "We cable readers, configure controllers, and test fail-safe behaviour so security and fire strategies stay aligned.",
    duration: "Two to four days depending on doors",
    startingPriceNgn: 410000,
    categoryId: "smart-systems",
    whatsIncluded: [
      "Controller programming",
      "Reader installation and cable tests",
      "Administrator training",
    ],
    relatedSlugs: ["cctv-installation", "structured-data-cabling"],
    addOns: [],
  },
  {
    slug: "structured-data-cabling",
    name: "Structured Data Cabling",
    shortDescription:
      "Copper and fibre backbone for offices, warehouses, and campuses.",
    fullDescription:
      "Certified cable runs, patch frames, and test results that survive IT audits and future bandwidth upgrades.",
    duration: "Project-based to drawing package",
    startingPriceNgn: 315000,
    categoryId: "smart-systems",
    whatsIncluded: [
      "Cable schedules and labelling",
      "Fluke or equivalent test exports",
      "As-built updates",
    ],
    relatedSlugs: ["cctv-installation", "access-control-systems"],
    addOns: [],
  },
  {
    slug: "solar-battery-storage",
    name: "Battery Storage Integration",
    shortDescription:
      "AC- or DC-coupled storage with safe shutdowns and monitoring.",
    fullDescription:
      "We integrate batteries with existing solar, set charge and discharge limits, and commission monitoring for state of health visibility.",
    duration: "Two to three days typical",
    startingPriceNgn: 1420000,
    categoryId: "solar",
    whatsIncluded: [
      "Electrical protection review",
      "Battery and inverter integration",
      "Customer training on operating modes",
    ],
    relatedSlugs: ["solar-installation", "consumer-unit-upgrade"],
    addOns: [],
  },
] as const;

export type ServiceSlug = (typeof SERVICES)[number]["slug"];

export const LANDING_PREVIEW_SLUGS: readonly ServiceSlug[] = [
  "cctv-installation",
  "electrical-wiring",
  "solar-installation",
  "smart-home-automation",
  "general-repairs",
] as const;

export const LANDING_FEATURED_SERVICE_SLUG: ServiceSlug = "cctv-installation";

export const LANDING_FEATURED_SERVICE_IMAGE = "/services/cctv-installation.svg" as const;

export function getServiceImageForRecord(service: ServiceRecord): string {
  return service.imageUrl ?? `/services/${service.slug}.svg`;
}

export function getServiceBySlug(slug: string): ServiceRecord | undefined {
  return SERVICES.find((service) => service.slug === slug);
}

export function getRelatedServices(service: ServiceRecord): ServiceRecord[] {
  return service.relatedSlugs
    .map((slug) => getServiceBySlug(slug))
    .filter((item): item is ServiceRecord => item !== undefined);
}

export function getServicesByCategory(
  categoryId: ServiceCategoryId | "all",
): readonly ServiceRecord[] {
  if (categoryId === "all") {
    return SERVICES;
  }
  return SERVICES.filter((service) => service.categoryId === categoryId);
}

export function isServiceCategoryId(
  value: string,
): value is ServiceCategoryId {
  return SERVICE_CATEGORIES.some((category) => category.id === value);
}

export function resolveServicesCategoryParam(
  raw: string | undefined,
): ServiceCategoryId | "all" {
  if (!raw || raw === "all") {
    return "all";
  }
  if (isServiceCategoryId(raw)) {
    return raw;
  }
  return "all";
}

export type LandingPreviewEntry = {
  slug: ServiceSlug;
  name: string;
  description: string;
  href: string;
};

export function getLandingPreviewServices(): LandingPreviewEntry[] {
  return LANDING_PREVIEW_SLUGS.map((slug) => {
    const record = SERVICES.find((service) => service.slug === slug);
    if (!record) {
      throw new Error(`Missing service definition for landing preview: ${slug}`);
    }
    return {
      slug,
      name: record.name,
      description: record.shortDescription,
      href: routes.serviceDetail(slug),
    };
  });
}

export function getLandingFeaturedService(): ServiceRecord {
  const record = getServiceBySlug(LANDING_FEATURED_SERVICE_SLUG);
  if (!record) {
    throw new Error("Featured landing service is not defined");
  }
  return record;
}

export function getLandingGridServices(): LandingPreviewEntry[] {
  return getLandingPreviewServices().filter(
    (item) => item.slug !== LANDING_FEATURED_SERVICE_SLUG,
  );
}
