import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthShell } from "@/components/layout/auth-shell";
import { ResetPasswordForm } from "@/components/sections/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
};

function ResetPasswordFallback() {
  return <p className="text-small text-muted">Loading reset form</p>;
}

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Reset password"
      subtitle="Create a new password to restore access to your account."
    >
      <Suspense fallback={<ResetPasswordFallback />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
