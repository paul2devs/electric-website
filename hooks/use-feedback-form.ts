"use client";

import { useCallback, useState } from "react";

import { submitFeedback } from "@/lib/feedback/api";

export type FeedbackFormState = {
  message: string;
  name: string;
  email: string;
};

export type FeedbackFormErrors = Partial<Record<keyof FeedbackFormState | "form", string>>;

type UseFeedbackFormOptions = {
  defaultName?: string;
  defaultEmail?: string;
};

export function useFeedbackForm(options: UseFeedbackFormOptions = {}) {
  const [values, setValues] = useState<FeedbackFormState>({
    message: "",
    name: options.defaultName ?? "",
    email: options.defaultEmail ?? "",
  });
  const [errors, setErrors] = useState<FeedbackFormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const setField = useCallback(
    <K extends keyof FeedbackFormState>(key: K, value: FeedbackFormState[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        if (!prev[key]) {
          return prev;
        }
        const next = { ...prev };
        delete next[key];
        return next;
      });
      if (status === "success") {
        setStatus("idle");
      }
    },
    [status],
  );

  const submit = useCallback(async () => {
    const nextErrors: FeedbackFormErrors = {};
    const message = values.message.trim();
    if (message.length < 10) {
      nextErrors.message = "Please share at least 10 characters of feedback.";
    }
    if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return { ok: false as const };
    }

    setStatus("submitting");
    setErrors({});
    try {
      const result = await submitFeedback({
        message,
        name: values.name.trim() || undefined,
        email: values.email.trim() || undefined,
      });
      setStatus("success");
      setValues((prev) => ({ ...prev, message: "" }));
      return { ok: true as const, result };
    } catch (error) {
      setStatus("idle");
      setErrors({
        form: error instanceof Error ? error.message : "Could not send feedback. Try again.",
      });
      return { ok: false as const };
    }
  }, [values]);

  return { values, errors, status, setField, submit };
}
