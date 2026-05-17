"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { useLoginForm } from "@/hooks/use-login-form";
import { routes } from "@/lib/constants/routes";
import { ApiError } from "@/lib/api/errors";
import { fallbackAuthError } from "@/lib/auth/error-message";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";

const labelClass = "text-small font-medium text-ink";
const fieldErrorClass = "text-small text-error";

function resolvePostLoginPath(nextParam: string | null): string {
  if (
    nextParam &&
    nextParam.startsWith("/") &&
    !nextParam.startsWith("//")
  ) {
    return nextParam;
  }
  return routes.dashboard;
}

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { values, errors, setField, submit: validate } = useLoginForm();
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      className="flex flex-col gap-6"
      noValidate
      onSubmit={async (event) => {
        event.preventDefault();
        setApiError(null);
        const result = validate();
        if (!result.ok) {
          return;
        }
        setSubmitting(true);
        try {
          await login(result.values.email, result.values.password);
          router.replace(resolvePostLoginPath(searchParams.get("next")));
        } catch (err) {
          if (err instanceof ApiError) {
            setApiError(err.message);
            return;
          }
          setApiError(fallbackAuthError);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {apiError ? (
        <p
          className="rounded-sm border border-error/25 bg-error-muted px-3 py-2 text-small text-error"
          role="alert"
        >
          {apiError}
        </p>
      ) : null}
      <div className="flex flex-col gap-2">
        <label className={labelClass} htmlFor="login-email">
          Email
        </label>
        <Input
          autoComplete="email"
          id="login-email"
          inputMode="email"
          invalid={Boolean(errors.email)}
          name="email"
          onChange={(event) => setField("email", event.target.value)}
          type="email"
          value={values.email}
        />
        {errors.email ? (
          <p className={cn(fieldErrorClass, "mt-1")} role="alert">
            {errors.email}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <label className={labelClass} htmlFor="login-password">
          Password
        </label>
        <PasswordInput
          autoComplete="current-password"
          id="login-password"
          invalid={Boolean(errors.password)}
          name="password"
          onChange={(event) => setField("password", event.target.value)}
          value={values.password}
        />
        {errors.password ? (
          <p className={cn(fieldErrorClass, "mt-1")} role="alert">
            {errors.password}
          </p>
        ) : null}
      </div>
      <Button type="submit" variant="primary" disabled={submitting}>
        {submitting ? "Signing in…" : "Sign in"}
      </Button>
      <Link className="link-accent text-small" href={routes.forgotPassword}>
        Forgot your password?
      </Link>
      <p className="text-small text-muted">
        Create your account to start booking services seamlessly.{" "}
        <Link className="link-accent" href={routes.register}>
          Register now
        </Link>
      </p>
    </form>
  );
}
