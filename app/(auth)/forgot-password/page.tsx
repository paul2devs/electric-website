import type { Metadata } from "next";

import { AuthShell } from "@/components/layout/auth-shell";
import { ForgotPasswordForm } from "@/components/sections/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot password"
      subtitle="Enter your email and we will send a secure reset link."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
