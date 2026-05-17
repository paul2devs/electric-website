import type { Metadata } from "next";

import { AuthShell } from "@/components/layout/auth-shell";
import { RegisterForm } from "@/components/sections/register-form";

export const metadata: Metadata = {
  title: "Create account",
};

export default function RegisterPage() {
  return (
    <AuthShell
      subtitle="Join Testimonydot and book professional electrical services in minutes."
      title="Create account"
    >
      <RegisterForm />
    </AuthShell>
  );
}
