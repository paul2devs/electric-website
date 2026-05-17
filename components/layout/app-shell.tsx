import type { ReactNode } from "react";

import { Footer } from "./footer";
import { PageBreadcrumbs } from "./page-breadcrumbs";
import { SiteHeader } from "./site-header";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <SiteHeader />
      <PageBreadcrumbs variant="marketing" />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
