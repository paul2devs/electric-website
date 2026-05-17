"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";
import { routes } from "@/lib/constants/routes";

type RequireAdminProps = {
  children: React.ReactNode;
};

export function RequireAdmin({ children }: RequireAdminProps) {
  const { isAuthenticated, isReady, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isReady) {
      return;
    }
    if (!isAuthenticated) {
      const next = encodeURIComponent(pathname);
      router.replace(`${routes.login}?next=${next}`);
      return;
    }
    if (user?.role !== "admin") {
      router.replace(routes.dashboard);
    }
  }, [isAuthenticated, isReady, pathname, router, user?.role]);

  if (!isReady || !isAuthenticated || user?.role !== "admin") {
    return (
      <div className="flex min-h-80 items-center justify-center px-6 text-small text-muted">
        Loading admin session
      </div>
    );
  }

  return <>{children}</>;
}
