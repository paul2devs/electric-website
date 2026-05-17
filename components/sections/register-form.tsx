"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useRegisterForm } from "@/hooks/use-register-form";
import { routes } from "@/lib/constants/routes";
import { ApiError } from "@/lib/api/errors";
import { fallbackAuthError } from "@/lib/auth/error-message";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { passwordRequirementStatus } from "@/lib/validation/auth-fields";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";

const labelClass = "text-small font-medium text-ink";
const fieldErrorClass = "text-small text-error";

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const { values, errors, setField, submit: validate } = useRegisterForm();
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const requirements = passwordRequirementStatus(values.password);

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
          await register(
            result.values.name,
            result.values.email,
            result.values.phone,
            result.values.password,
            result.values.confirmPassword,
          );
          router.replace(routes.login);
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
        <label className={labelClass} htmlFor="register-name">
          Full name
        </label>
        <Input
          autoComplete="name"
          id="register-name"
          invalid={Boolean(errors.name)}
          name="name"
          onChange={(event) => setField("name", event.target.value)}
          type="text"
          value={values.name}
        />
        {errors.name ? (
          <p className={cn(fieldErrorClass, "mt-1")} role="alert">
            {errors.name}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <label className={labelClass} htmlFor="register-email">
          Email
        </label>
        <Input
          autoComplete="email"
          id="register-email"
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
        <label className={labelClass} htmlFor="register-phone">
          Phone <span className="text-error">*</span>
        </label>
        <Input
          autoComplete="tel"
          id="register-phone"
          inputMode="tel"
          invalid={Boolean(errors.phone)}
          name="phone"
          onChange={(event) => setField("phone", event.target.value)}
          type="text"
          value={values.phone}
          placeholder="+234 801 234 5678"
        />
        {errors.phone ? (
          <p className={cn(fieldErrorClass, "mt-1")} role="alert">
            {errors.phone}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <label className={labelClass} htmlFor="register-password">
          Password
        </label>
        <PasswordInput
          autoComplete="new-password"
          id="register-password"
          invalid={Boolean(errors.password)}
          name="password"
          onChange={(event) => setField("password", event.target.value)}
          value={values.password}
        />
        <ul className="mt-1 space-y-1 text-small text-muted">
          <li className={cn(requirements.minLength ? "text-success" : undefined)}>
            At least 8 characters
          </li>
          <li className={cn(requirements.uppercase ? "text-success" : undefined)}>
            Contains uppercase
          </li>
          <li className={cn(requirements.number ? "text-success" : undefined)}>
            Contains number
          </li>
        </ul>
        {errors.password ? (
          <p className={cn(fieldErrorClass, "mt-1")} role="alert">
            {errors.password}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <label className={labelClass} htmlFor="register-confirm">
          Confirm password
        </label>
        <PasswordInput
          autoComplete="new-password"
          id="register-confirm"
          invalid={Boolean(errors.confirmPassword)}
          name="confirmPassword"
          onChange={(event) => setField("confirmPassword", event.target.value)}
          value={values.confirmPassword}
        />
        {errors.confirmPassword ? (
          <p className={cn(fieldErrorClass, "mt-1")} role="alert">
            {errors.confirmPassword}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <label className="flex cursor-pointer items-start gap-3 text-small text-muted">
          <input
            checked={values.acceptedTerms}
            className="mt-0.5 size-4 shrink-0 rounded-sm border border-border accent-accent"
            id="register-terms"
            name="acceptedTerms"
            onChange={(event) => setField("acceptedTerms", event.target.checked)}
            type="checkbox"
          />
          <span>
            I agree to the{" "}
            <Link className="link-accent" href={routes.terms} target="_blank" rel="noopener noreferrer">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              className="link-accent"
              href={routes.privacy}
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.acceptedTerms ? (
          <p className={cn(fieldErrorClass, "mt-1")} role="alert">
            {errors.acceptedTerms}
          </p>
        ) : null}
      </div>
      <Button type="submit" variant="primary" disabled={submitting}>
        {submitting ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-small text-muted">
        Join Testimonydot and book professional electrical services in minutes.{" "}
      </p>
      <p className="text-small text-muted">
        Already registered?{" "}
        <Link className="link-accent" href={routes.login}>
          Sign in
        </Link>
      </p>
    </form>
  );
}
