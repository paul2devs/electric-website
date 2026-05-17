import type { ReactNode } from "react";

import { RequireAuth } from "@/components/auth/require-auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function DashboardGroupLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <RequireAuth>
      <DashboardShell>{children}</DashboardShell>
    </RequireAuth>
  );
}
