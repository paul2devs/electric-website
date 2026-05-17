import type { ReactNode } from "react";
import Link from "next/link";

import { AdminSidebarNav } from "@/components/admin/admin-sidebar-nav";
import { PageBreadcrumbs } from "@/components/layout/page-breadcrumbs";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { brandName } from "@/lib/constants/navigation";
import { routes } from "@/lib/constants/routes";

import { Container } from "./container";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <div className="border-b border-border">
        <Container className="flex h-14 items-center justify-between">
          <Link href={routes.home} className="text-small font-semibold tracking-tight">
            {brandName} Admin
          </Link>
          <div className="flex items-center gap-6">
            <NotificationBell />
            <SignOutButton />
            <Link href={routes.home} className="text-small text-muted font-medium">
              Exit admin
            </Link>
          </div>
        </Container>
      </div>
      <PageBreadcrumbs variant="admin" />
      <Container className="flex flex-col gap-8 py-8 lg:flex-row lg:items-start">
        <aside className="border-b border-border pb-6 lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
          <p className="text-small font-medium text-muted uppercase tracking-wide">Operations</p>
          <AdminSidebarNav />
        </aside>
        <section className="min-h-80 min-w-0 flex-1">{children}</section>
      </Container>
    </div>
  );
}
