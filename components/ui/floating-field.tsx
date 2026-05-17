"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FloatingFieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export function FloatingField({ id, label, error, hint, children }: FloatingFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={cn(
          "relative rounded-sm border bg-surface pt-5 transition-colors duration-150",
          error ? "border-error" : "border-border focus-within:border-ink/40",
        )}
      >
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-3 top-2 text-[11px] font-medium uppercase tracking-[0.08em] text-muted"
        >
          {label}
        </label>
        {children}
      </div>
      {error ? (
        <p className="text-small text-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-small text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
