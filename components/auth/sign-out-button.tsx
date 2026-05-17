"use client";

import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";
import { routes } from "@/lib/constants/routes";

export function SignOutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <button
      type="button"
      className="text-small text-muted font-medium transition-colors duration-150 hover:text-ink"
      onClick={async () => {
        await logout();
        router.replace(routes.home);
      }}
    >
      Sign out
    </button>
  );
}
