import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

const inputClass =
  "w-full rounded-sm border bg-surface px-3 py-2 text-body text-ink placeholder:text-muted transition-[border-color,box-shadow] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent focus-visible:ring-2 focus-visible:ring-accent/25 disabled:cursor-not-allowed disabled:opacity-50";

const inputStateNormal = "border-border";
const inputStateInvalid =
  "border-error focus-visible:outline-error focus-visible:ring-error/20";

export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <input
      className={cn(inputClass, invalid ? inputStateInvalid : inputStateNormal, className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}
