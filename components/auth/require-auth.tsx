"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";
import { routes } from "@/lib/constants/routes";

type RequireAuthProps = {
  children: React.ReactNode;
};

export function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated, isReady } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isReady) {
      return;
    }
    if (!isAuthenticated) {
      const next = encodeURIComponent(pathname);
      router.replace(`${routes.login}?next=${next}`);
    }
  }, [isAuthenticated, isReady, pathname, router]);

  if (!isReady || !isAuthenticated) {
    return (
      <div className="flex min-h-80 items-center justify-center px-6 text-small text-muted">
        Loading session
      </div>
    );
  }

  return <>{children}</>;
}
