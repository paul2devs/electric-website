export const ADMIN_SERVICE_CATEGORY_OPTIONS = [
  { value: "installation", label: "Installation" },
  { value: "repairs", label: "Repairs" },
  { value: "smart-systems", label: "Smart Systems" },
  { value: "solar", label: "Solar" },
  { value: "maintenance", label: "Maintenance" },
  { value: "inspection", label: "Inspection" },
] as const;

export type AdminServiceCategoryValue = (typeof ADMIN_SERVICE_CATEGORY_OPTIONS)[number]["value"];
