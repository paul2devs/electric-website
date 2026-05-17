"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { routes } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: (className?: string) => ReactNode;
};

const iconClass = "h-4 w-4 shrink-0";

const icons = {
  overview: (className?: string) => (
    <svg viewBox="0 0 24 24" aria-hidden className={cn(iconClass, className)} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" />
      <rect x="13" y="10" width="8" height="11" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
    </svg>
  ),
  bookings: (className?: string) => (
    <svg viewBox="0 0 24 24" aria-hidden className={cn(iconClass, className)} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M8 2v4M16 2v4M3 9h18" />
    </svg>
  ),
  invoices: (className?: string) => (
    <svg viewBox="0 0 24 24" aria-hidden className={cn(iconClass, className)} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 3h8l4 4v14H7z" />
      <path d="M15 3v4h4M10 12h6M10 16h6" />
    </svg>
  ),
  settings: (className?: string) => (
    <svg viewBox="0 0 24 24" aria-hidden className={cn(iconClass, className)} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
      <path d="M20.6 13.6v-3.2l-2.1-.6a7 7 0 0 0-.8-1.8l1.1-1.9-2.3-2.3-1.9 1.1a7 7 0 0 0-1.8-.8l-.6-2.1H10l-.6 2.1a7 7 0 0 0-1.8.8L5.7 3.8 3.4 6.1l1.1 1.9a7 7 0 0 0-.8 1.8l-2.1.6v3.2l2.1.6a7 7 0 0 0 .8 1.8l-1.1 1.9 2.3 2.3 1.9-1.1a7 7 0 0 0 1.8.8l.6 2.1h3.2l.6-2.1a7 7 0 0 0 1.8-.8l1.9 1.1 2.3-2.3-1.1-1.9a7 7 0 0 0 .8-1.8z" />
    </svg>
  ),
};

const items: readonly NavItem[] = [
  { label: "Overview", href: routes.dashboard, icon: icons.overview },
  { label: "Bookings", href: routes.dashboardBookings, icon: icons.bookings },
  { label: "Invoices", href: routes.dashboardInvoices, icon: icons.invoices },
  { label: "Settings", href: routes.dashboardSettings, icon: icons.settings },
] as const;

type SidebarNavProps = {
  collapsed?: boolean;
  onNavigate?: () => void;
};

export function SidebarNav({ collapsed = false, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard" className="mt-4 flex flex-col gap-2">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-sm px-3 py-2 text-small font-medium transition-colors",
              active
                ? "bg-accent-muted text-ink"
                : "text-muted hover:bg-hover hover:text-ink",
              collapsed ? "justify-center px-2" : "",
            )}
            title={collapsed ? item.label : undefined}
          >
            {item.icon(active ? "text-accent" : "text-current")}
            {collapsed ? <span className="sr-only">{item.label}</span> : item.label}
          </Link>
        );
      })}
    </nav>
  );
}
