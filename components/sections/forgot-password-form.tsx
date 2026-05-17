"use client";

import { useState } from "react";

import { ApiError } from "@/lib/api/errors";
import { authForgotPassword } from "@/lib/auth/auth-api";
import { fallbackAuthError } from "@/lib/auth/error-message";
import { validateEmail } from "@/lib/validation/auth-fields";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      className="flex flex-col gap-6"
      noValidate
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);
        const emailError = validateEmail(email);
        if (emailError) {
          setError(emailError);
          return;
        }
        setSubmitting(true);
        try {
          const response = await authForgotPassword(email.trim());
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
        <label className="text-small font-medium text-ink" htmlFor="forgot-email">
          Email
        </label>
        <Input
          id="forgot-email"
          name="email"
          type="email"
          autoComplete="email"
          invalid={Boolean(error)}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      {error ? (
        <p
          className="rounded-sm border border-error/25 bg-error-muted px-3 py-2 text-small text-error"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="rounded-sm border border-success/25 bg-success-muted px-3 py-2 text-small text-success">
          {success}
        </p>
      ) : null}
      <Button type="submit" disabled={submitting}>
        {submitting ? "Sending..." : "Send reset link"}
      </Button>
    </form>
  );
}
