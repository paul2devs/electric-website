import { routes } from "@/lib/constants/routes";

export type BreadcrumbItem = {
  label: string;
  href: string;
};

const SERVICE_SLUG_LABEL: Record<string, string> = {
  "cctv-installation": "CCTV Installation",
  "electrical-wiring": "Electrical Wiring",
  "solar-installation": "Solar Installation",
  "smart-home-automation": "Smart Home Automation",
  "general-repairs": "General Repairs",
  "consumer-unit-upgrade": "Consumer Unit Upgrade",
  "lighting-installation-programmes": "Lighting Installation",
  "preventive-maintenance-contracts": "Preventive Maintenance",
  "generator-servicing": "Generator Servicing",
  "emergency-call-out": "Emergency Call-Out",
  "periodic-inspection": "Electrical Safety Inspection",
  "pre-purchase-assessment": "Pre-Purchase Assessment",
  "access-control-systems": "Access Control",
  "structured-data-cabling": "Structured Data Cabling",
  "solar-battery-storage": "Battery Storage",
};

function labelForServiceSlug(slug: string): string {
  return SERVICE_SLUG_LABEL[slug] ?? slug.replace(/-/g, " ");
}

export function marketingBreadcrumbs(pathname: string): BreadcrumbItem[] | null {
  if (pathname === routes.home) {
    return null;
  }

  if (pathname === routes.services) {
    return [
      { label: "Home", href: routes.home },
      { label: "Services", href: routes.services },
    ];
  }

  if (pathname.startsWith(`${routes.services}/`)) {
    const slug = pathname.slice(routes.services.length + 1).split("/")[0] ?? "";
    if (!slug) {
      return null;
    }
    return [
      { label: "Home", href: routes.home },
      { label: "Services", href: routes.services },
      { label: labelForServiceSlug(slug), href: `${routes.services}/${slug}` },
    ];
  }

  if (pathname === routes.ourWork) {
    return [
      { label: "Home", href: routes.home },
      { label: "Our work", href: routes.ourWork },
    ];
  }

  if (pathname === routes.about) {
    return [
      { label: "Home", href: routes.home },
      { label: "About", href: routes.about },
    ];
  }

  if (pathname === routes.contact) {
    return [
      { label: "Home", href: routes.home },
      { label: "Contact", href: routes.contact },
    ];
  }

  if (pathname === routes.book) {
    return [
      { label: "Home", href: routes.home },
      { label: "Book", href: routes.book },
    ];
  }

  if (pathname === routes.terms) {
    return [
      { label: "Home", href: routes.home },
      { label: "Terms", href: routes.terms },
    ];
  }

  if (pathname === routes.privacy) {
    return [
      { label: "Home", href: routes.home },
      { label: "Privacy", href: routes.privacy },
    ];
  }

  if (pathname === routes.cookies) {
    return [
      { label: "Home", href: routes.home },
      { label: "Cookies", href: routes.cookies },
    ];
  }

  return null;
}

export function dashboardBreadcrumbs(pathname: string): BreadcrumbItem[] | null {
  if (pathname === routes.dashboard) {
    return [{ label: "Workspace", href: routes.dashboard }];
  }
  if (pathname.startsWith("/bookings/")) {
    const id = pathname.replace("/bookings/", "").split("/")[0];
    return [
      { label: "Workspace", href: routes.dashboard },
      { label: "Bookings", href: routes.dashboardBookings },
      { label: id ? `Booking ${id.slice(0, 8)}` : "Booking", href: pathname },
    ];
  }
  if (pathname === "/bookings") {
    return [
      { label: "Workspace", href: routes.dashboard },
      { label: "Bookings", href: routes.dashboardBookings },
    ];
  }
  if (pathname === "/invoices") {
    return [
      { label: "Workspace", href: routes.dashboard },
      { label: "Invoices", href: routes.dashboardInvoices },
    ];
  }
  if (pathname === "/settings") {
    return [
      { label: "Workspace", href: routes.dashboard },
      { label: "Settings", href: routes.dashboardSettings },
    ];
  }
  return null;
}

export function adminBreadcrumbs(pathname: string): BreadcrumbItem[] | null {
  if (pathname === routes.admin) {
    return [{ label: "Admin", href: routes.admin }];
  }
  if (pathname === routes.adminBookings) {
    return [
      { label: "Admin", href: routes.admin },
      { label: "Bookings", href: routes.adminBookings },
    ];
  }
  if (pathname.startsWith("/admin/bookings/")) {
    const id = pathname.replace("/admin/bookings/", "").split("/")[0];
    return [
      { label: "Admin", href: routes.admin },
      { label: "Bookings", href: routes.adminBookings },
      { label: id ? `Booking ${id.slice(0, 8)}` : "Booking", href: pathname },
    ];
  }
  if (pathname === routes.adminServices) {
    return [
      { label: "Admin", href: routes.admin },
      { label: "Services", href: routes.adminServices },
    ];
  }
  if (pathname === routes.adminUsers) {
    return [
      { label: "Admin", href: routes.admin },
      { label: "Users", href: routes.adminUsers },
    ];
  }
  if (pathname === routes.adminTechnicians) {
    return [
      { label: "Admin", href: routes.admin },
      { label: "Technicians", href: routes.adminTechnicians },
    ];
  }
  if (pathname === routes.adminAnalytics) {
    return [
      { label: "Admin", href: routes.admin },
      { label: "Analytics", href: routes.adminAnalytics },
    ];
  }
  return null;
}
