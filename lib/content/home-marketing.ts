export const featureHighlightContent = {
  label: "System",
  heading: "A smarter way to book and manage electrical services.",
  subtext:
    "From real-time availability to structured pricing, every part of the system is designed to remove friction and ensure reliable service delivery.",
  features: [
    {
      title: "Real-time Scheduling",
      description:
        "Live slots and locks reduce double-booking and keep crews aligned to your site windows.",
    },
    {
      title: "Smart Pricing System",
      description:
        "Distance, urgency, and add-ons are calculated up front so approvals happen faster.",
    },
    {
      title: "Structured Booking Flow",
      description:
        "A consistent path from service selection to confirmation — fewer handoffs, clearer accountability.",
    },
  ],
} as const;

export const socialProofContent = {
  headerLabel: "Proof",
  headerHeading: "Trusted execution, measured outcomes.",
  metrics: [
    { value: "500+", label: "Projects Completed" },
    { value: "10+", label: "Years Experience" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "24/7", label: "Availability" },
  ],
  context:
    "Residential estates, commercial facilities, and industrial sites across Nigeria — supported with the same disciplined operating model.",
  quote:
    "Structured from first contact to handover — clear scope, predictable timelines, and professional follow-through.",
  quoteAttribution: "Facilities lead",
} as const;

export const emergencySupportContent = {
  title: "Electrical emergencies handled with priority response.",
  conditions: [
    "Power outage",
    "Electrical burning smell",
    "Faulty wiring",
    "Sudden system failure",
    "Unsafe electrical conditions",
  ],
  supporting:
    "If it affects safety or power stability, it is treated as priority.",
  cardTitle: "Request Priority Assistance",
  primaryCta: "Request emergency service",
  secondaryCta: "Call support",
} as const;

export const aboutPreviewContent = {
  label: "About",
  heading: "Built on precision, reliability, and professional execution.",
  description:
    "Testimonydot provides structured electrical services designed for real-world reliability. From installations to repairs and advanced systems, every job is handled with a focus on safety, consistency, and long-term performance.",
  credibility: [
    "10+ years of experience",
    "500+ completed projects",
    "Fast response scheduling",
    "Certified technicians",
  ],
  ctaLabel: "Learn more about Testimonydot",
  imageSrc: "/about-workspace.jpg",
  imageAlt: "Technician working at an organised electrical workspace",
} as const;

export const finalCtaContent = {
  heading: "Book your service with confidence.",
  subtext:
    "Schedule installations, repairs, or emergency services in minutes with a structured and reliable booking system.",
  primaryCta: "Book a service",
  secondaryCta: "View services",
} as const;
