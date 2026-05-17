"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";

import { Input, type InputProps } from "./input";

type PasswordInputProps = Omit<InputProps, "type">;

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg
      aria-hidden
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
      {off ? <path d="m3 3 18 18" /> : null}
    </svg>
  );
}

export function PasswordInput({ className, id, invalid, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="relative">
      <Input
        {...props}
        id={inputId}
        invalid={invalid}
        type={visible ? "text" : "password"}
        className={cn("pr-11", className)}
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        <EyeIcon off={!visible} />
      </button>
    </div>
  );
}
