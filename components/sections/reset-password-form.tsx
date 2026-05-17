"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { ApiError } from "@/lib/api/errors";
import { authResetPassword } from "@/lib/auth/auth-api";
import { fallbackAuthError } from "@/lib/auth/error-message";
import { routes } from "@/lib/constants/routes";
import {
  passwordRequirementStatus,
  validatePassword,
  validatePasswordMatch,
} from "@/lib/validation/auth-fields";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const requirements = passwordRequirementStatus(password);

  return (
    <form
      className="flex flex-col gap-6"
      noValidate
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        if (!token.trim()) {
          setError("Reset token is missing or invalid.");
          return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
          setError(passwordError);
          return;
        }
        const matchError = validatePasswordMatch(password, confirmPassword);
        if (matchError) {
          setError(matchError);
          return;
        }

        setSubmitting(true);
        try {
          const response = await authResetPassword(token, password);
          setSuccess(response.message);
        } catch (err) {
          if (err instanceof ApiError) {
            setError(err.message);
          } else {
            setError(fallbackAuthError);
          }
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <div className="flex flex-col gap-2">
        <label className="text-small font-medium text-ink" htmlFor="reset-password">
          New password
        </label>
        <PasswordInput
          id="reset-password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <ul className="mt-1 space-y-1 text-small text-muted">
          <li className={cn(requirements.minLength ? "text-ink" : undefined)}>
            At least 8 characters
          </li>
          <li className={cn(requirements.uppercase ? "text-ink" : undefined)}>
            Contains uppercase
          </li>
          <li className={cn(requirements.number ? "text-ink" : undefined)}>
            Contains number
          </li>
        </ul>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-small font-medium text-ink" htmlFor="reset-confirm-password">
          Confirm new password
        </label>
        <PasswordInput
          id="reset-confirm-password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
      </div>
      {error ? <p className="text-small text-ink">{error}</p> : null}
      {success ? (
        <p className="text-small text-ink">
          {success}{" "}
          <Link className="font-medium underline" href={routes.login}>
            Sign in
          </Link>
        </p>
      ) : null}
      <Button type="submit" disabled={submitting}>
        {submitting ? "Resetting..." : "Reset password"}
      </Button>
    </form>
  );
}
