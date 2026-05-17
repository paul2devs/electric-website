import { SERVICES } from "@/lib/data/services";

export type ContactServiceOption = {
  value: string;
  label: string;
};

export const CONTACT_SERVICE_OPTIONS: readonly ContactServiceOption[] = [
  { value: "", label: "Select a service (optional)" },
  ...SERVICES.map((service) => ({
    value: service.slug,
    label: service.name,
  })),
  { value: "general-enquiry", label: "General enquiry" },
  { value: "emergency", label: "Emergency call-out" },
];
