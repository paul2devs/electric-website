import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

const adminEmail =
  process.env.ADMIN_EMAIL?.trim().toLowerCase() || "testimonydot@gmail.com";
const adminPassword =
  process.env.ADMIN_PASSWORD?.trim() || "Testimony@2026#Admin";

const serviceSeeds = [
  {
    name: "CCTV Installation",
    category: "smart-systems",
    basePrice: 285000,
    duration: 120,
    pricingType: "fixed",
    addOns: [
      { name: "Remote monitoring setup", price: 65000 },
      { name: "After-hours commissioning", price: 45000 },
    ],
  },
  {
    name: "Electrical Wiring",
    category: "installation",
    basePrice: 485000,
    duration: 180,
    pricingType: "fixed",
    addOns: [{ name: "Dedicated circuits for HVAC or kitchen loads", price: 95000 }],
  },
  {
    name: "Solar Installation",
    category: "solar",
    basePrice: 1850000,
    duration: 240,
    pricingType: "fixed",
    addOns: [{ name: "Battery storage add-on", price: 890000 }],
  },
  {
    name: "Smart Home Automation",
    category: "smart-systems",
    basePrice: 320000,
    duration: 120,
    pricingType: "fixed",
    addOns: [{ name: "Guest and staff access profiles", price: 55000 }],
  },
  {
    name: "General Repairs",
    category: "repairs",
    basePrice: 48000,
    duration: 60,
    pricingType: "fixed",
    addOns: [{ name: "Extended labour block", price: 35000 }],
  },
  {
    name: "Consumer Unit Upgrade",
    category: "installation",
    basePrice: 195000,
    duration: 120,
    pricingType: "fixed",
    addOns: [{ name: "Surge protection device", price: 72000 }],
  },
  {
    name: "Lighting Installation Programmes",
    category: "installation",
    basePrice: 265000,
    duration: 180,
    pricingType: "fixed",
    addOns: [{ name: "Emergency lighting verification", price: 42000 }],
  },
  {
    name: "Preventive Maintenance Contracts",
    category: "maintenance",
    basePrice: 145000,
    duration: 120,
    pricingType: "fixed",
    addOns: [
      { name: "Thermal scan report", price: 35000 },
      { name: "Priority weekend window", price: 25000 },
    ],
  },
  {
    name: "Generator & Transfer Switch Servicing",
    category: "maintenance",
    basePrice: 88000,
    duration: 120,
    pricingType: "fixed",
    addOns: [{ name: "Fuel system inspection", price: 22000 }],
  },
  {
    name: "Emergency Call-Out",
    category: "repairs",
    basePrice: 75000,
    duration: 60,
    pricingType: "fixed",
    addOns: [{ name: "Night or weekend attendance", price: 40000 }],
  },
  {
    name: "Electrical Safety Inspection",
    category: "inspection",
    basePrice: 165000,
    duration: 240,
    pricingType: "fixed",
    addOns: [{ name: "Detailed remediation roadmap", price: 55000 }],
  },
  {
    name: "Pre-Purchase Property Assessment",
    category: "inspection",
    basePrice: 125000,
    duration: 120,
    pricingType: "fixed",
    addOns: [{ name: "Executive briefing call", price: 18000 }],
  },
  {
    name: "Access Control Systems",
    category: "smart-systems",
    basePrice: 410000,
    duration: 240,
    pricingType: "fixed",
    addOns: [{ name: "Fail-safe retest window", price: 32000 }],
  },
  {
    name: "Structured Data Cabling",
    category: "smart-systems",
    basePrice: 315000,
    duration: 180,
    pricingType: "fixed",
    addOns: [{ name: "Fluke certification pack", price: 28000 }],
  },
  {
    name: "Battery Storage Integration",
    category: "solar",
    basePrice: 1420000,
    duration: 240,
    pricingType: "fixed",
    addOns: [{ name: "Monitoring dashboard setup", price: 45000 }],
  },
] as const;

const catalogMetaByName: Record<string, { slug: string; imageUrl: string }> = {
  "CCTV Installation": { slug: "cctv-installation", imageUrl: "/services/cctv-installation.svg" },
  "Electrical Wiring": { slug: "electrical-wiring", imageUrl: "/services/electrical-wiring.svg" },
  "Solar Installation": { slug: "solar-installation", imageUrl: "/services/solar-installation.svg" },
  "Smart Home Automation": {
    slug: "smart-home-automation",
    imageUrl: "/services/smart-home-automation.svg",
  },
  "General Repairs": { slug: "general-repairs", imageUrl: "/services/general-repairs.svg" },
  "Consumer Unit Upgrade": {
    slug: "consumer-unit-upgrade",
    imageUrl: "/services/consumer-unit-upgrade.svg",
  },
  "Lighting Installation Programmes": {
    slug: "lighting-installation-programmes",
    imageUrl: "/services/lighting-installation-programmes.svg",
  },
  "Preventive Maintenance Contracts": {
    slug: "preventive-maintenance-contracts",
    imageUrl: "/services/preventive-maintenance-contracts.svg",
  },
  "Generator & Transfer Switch Servicing": {
    slug: "generator-servicing",
    imageUrl: "/services/generator-servicing.svg",
  },
  "Emergency Call-Out": { slug: "emergency-call-out", imageUrl: "/services/emergency-call-out.svg" },
  "Electrical Safety Inspection": {
    slug: "periodic-inspection",
    imageUrl: "/services/periodic-inspection.svg",
  },
  "Pre-Purchase Property Assessment": {
    slug: "pre-purchase-assessment",
    imageUrl: "/services/pre-purchase-assessment.svg",
  },
  "Access Control Systems": {
    slug: "access-control-systems",
    imageUrl: "/services/access-control-systems.svg",
  },
  "Structured Data Cabling": {
    slug: "structured-data-cabling",
    imageUrl: "/services/structured-data-cabling.svg",
  },
  "Battery Storage Integration": {
    slug: "solar-battery-storage",
    imageUrl: "/services/solar-battery-storage.svg",
  },
};

async function seedServices() {
  for (const seed of serviceSeeds) {
    const meta = catalogMetaByName[seed.name];
    const service = await prisma.service.upsert({
      where: { name: seed.name },
      update: {
        category: seed.category,
        basePrice: seed.basePrice,
        duration: seed.duration,
        pricingType: seed.pricingType,
        slug: meta?.slug ?? null,
        imageUrl: meta?.imageUrl ?? null,
      },
      create: {
        name: seed.name,
        category: seed.category,
        basePrice: seed.basePrice,
        duration: seed.duration,
        pricingType: seed.pricingType,
        slug: meta?.slug ?? null,
        imageUrl: meta?.imageUrl ?? null,
      },
    });

    await prisma.addOn.deleteMany({ where: { serviceId: service.id } });
    await prisma.addOn.createMany({
      data: seed.addOns.map((addon) => ({
        serviceId: service.id,
        name: addon.name,
        price: addon.price,
      })),
    });
  }
}

async function seedAdmin() {
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Testimony Admin",
      role: "admin",
      password: passwordHash,
      phone: "+2348000000000",
    },
    create: {
      name: "Testimony Admin",
      email: adminEmail,
      role: "admin",
      password: passwordHash,
      phone: "+2348000000000",
      address: "Lagos",
    },
  });
}

async function main() {
  await seedServices();
  await seedAdmin();
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
