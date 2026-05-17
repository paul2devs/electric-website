"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { PageBreadcrumbs } from "@/components/layout/page-breadcrumbs";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { useAuth } from "@/hooks/use-auth";
import { brandName } from "@/lib/constants/navigation";
import { routes } from "@/lib/constants/routes";

import { Container } from "./container";

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = (user?.name?.trim().slice(0, 1) || "U").toUpperCase();

  return (
    <div className="min-h-screen bg-zinc-50 text-ink">
      <div className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/95 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open workspace menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-border text-muted hover:bg-hover hover:text-ink lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <Link href={routes.home} className="text-small font-semibold tracking-tight">
              {brandName}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="relative">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-small font-semibold text-ink transition-colors hover:bg-hover"
                aria-label="Open profile menu"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                {initials}
              </button>
              {menuOpen ? (
                <div className="absolute right-0 mt-3 w-44 rounded-sm border border-border bg-surface p-1 shadow-sm">
                  <Link
                    href={routes.dashboardSettings}
                    className="block rounded-sm px-3 py-2 text-small text-muted hover:bg-hover hover:text-ink"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile / Settings
                  </Link>
                  <button
                    type="button"
                    className="block w-full rounded-sm px-3 py-2 text-left text-small text-muted hover:bg-hover hover:text-ink"
                    onClick={async () => {
                      await logout();
                      router.replace(routes.home);
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </Container>
      </div>

      <PageBreadcrumbs variant="dashboard" />

      <Container className="flex flex-col gap-8 py-8 lg:flex-row lg:items-start">
        <aside
          className={`hidden border-b border-border pb-6 lg:block ${collapsed ? "lg:w-20" : "lg:w-64"} lg:shrink-0 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-4`}
        >
          <div className="flex items-center justify-between">
            <p
              className={`text-small font-medium uppercase tracking-wide text-muted ${collapsed ? "sr-only" : ""}`}
            >
              Workspace
            </p>
            <button
              type="button"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-border text-muted hover:bg-hover hover:text-ink"
              onClick={() => setCollapsed((prev) => !prev)}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                {collapsed ? <path d="m9 6 6 6-6 6" /> : <path d="m15 6-6 6 6 6" />}
              </svg>
            </button>
          </div>
          <SidebarNav collapsed={collapsed} />
        </aside>

        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden" aria-hidden={!mobileOpen}>
            <button
              type="button"
              aria-label="Close workspace menu"
              className="absolute inset-0 bg-ink/20 backdrop-blur-[1px]"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="absolute inset-y-0 left-0 w-[18rem] border-r border-border bg-surface p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-small font-medium uppercase tracking-[0.14em] text-muted">
                  Workspace
                </p>
                <button
                  type="button"
                  aria-label="Close workspace menu"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-border text-muted hover:bg-hover hover:text-ink"
                  onClick={() => setMobileOpen(false)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>
              <SidebarNav onNavigate={() => setMobileOpen(false)} />
            </aside>
          </div>
        ) : null}

        <section className="min-h-80 min-w-0 flex-1">{children}</section>
      </Container>
    </div>
  );
}
