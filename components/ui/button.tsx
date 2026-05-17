import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "onDark" | "onDarkOutline";
};

export const buttonBaseClass =
  "inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2 text-small font-medium transition-[transform,filter,background-color,color,box-shadow] duration-150 disabled:pointer-events-none disabled:opacity-50 active:scale-95";

export const buttonVariantClass = {
  primary:
    "bg-gradient-to-r from-[#3d6fd8] via-[#5b8def] to-[#7aa7f5] text-surface shadow-md hover:brightness-110 hover:shadow-lg active:brightness-95",
  secondary:
    "border border-border bg-surface text-ink hover:border-accent/40 hover:bg-accent-muted/60 active:bg-accent-muted",
  onDark:
    "bg-white text-ink shadow-md hover:brightness-105 hover:shadow-lg active:brightness-95",
  onDarkOutline:
    "border border-white/40 bg-transparent text-white hover:bg-white/10 hover:border-white/55",
} as const;

export function buttonClassName(
  variant: keyof typeof buttonVariantClass = "primary",
  className?: string,
) {
  return cn(buttonBaseClass, buttonVariantClass[variant], className);
}

export function Button({
  children,
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName(variant, className)}
      {...props}
    >
      {children}
    </button>
  );
}
