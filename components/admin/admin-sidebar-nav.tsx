"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { routes } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

const items = [
  { label: "Dashboard", href: routes.admin },
  { label: "Bookings", href: routes.adminBookings },
  { label: "Services", href: routes.adminServices },
  { label: "Technicians", href: routes.adminTechnicians },
  { label: "Users", href: routes.adminUsers },
  { label: "Feedback", href: routes.adminFeedback },
  { label: "Analytics", href: routes.adminAnalytics },
] as const;

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="mt-4 flex flex-col gap-2">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-sm px-3 py-2 text-small font-medium transition-colors",
              active ? "bg-hover text-ink" : "text-muted hover:bg-hover hover:text-ink",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
