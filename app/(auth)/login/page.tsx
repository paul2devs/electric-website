import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthShell } from "@/components/layout/auth-shell";
import { LoginForm } from "@/components/sections/login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

function LoginFallback() {
  return (
    <p className="text-small text-muted">Loading sign-in form</p>
  );
}

export default function LoginPage() {
  return (
    <AuthShell
      subtitle="Access your dashboard and manage your bookings."
      title="Sign in"
    >
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
