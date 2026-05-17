import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

const textareaClass =
  "min-h-32 w-full rounded-sm border border-border bg-surface px-3 py-2 text-body text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-50";

export function Textarea({ className, invalid, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(textareaClass, invalid && "border-error focus-visible:outline-error", className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}
