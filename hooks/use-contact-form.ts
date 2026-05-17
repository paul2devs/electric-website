"use client";

import { useCallback, useState } from "react";

import { getContactEmail } from "@/lib/constants/site-contact";
import { CONTACT_SERVICE_OPTIONS } from "@/lib/contact/service-options";
import type { ContactFieldErrors } from "@/lib/validation/contact-fields";
import {
  validateContactEmail,
  validateContactMessage,
  validateContactName,
  validateContactPhone,
} from "@/lib/validation/contact-fields";

export type ContactFormState = {
  fullName: string;
  email: string;
  phone: string;
  serviceNeeded: string;
  message: string;
};

const initialState: ContactFormState = {
  fullName: "",
  email: "",
  phone: "",
  serviceNeeded: "",
  message: "",
};

export type ContactFormStatus = "idle" | "submitting" | "success";

type UseContactFormOptions = {
  serviceName?: string;
  initialMessage?: string;
  initialServiceSlug?: string;
};

function resolveInitialServiceSlug(
  serviceName?: string,
  initialServiceSlug?: string,
): string {
  if (initialServiceSlug) {
    return initialServiceSlug;
  }
  if (!serviceName) {
    return "";
  }
  const match = CONTACT_SERVICE_OPTIONS.find((item) => item.label === serviceName);
  return match?.value ?? "";
}

export function useContactForm(options: UseContactFormOptions = {}) {
  const [values, setValues] = useState<ContactFormState>(() => ({
    ...initialState,
    serviceNeeded: resolveInitialServiceSlug(options.serviceName, options.initialServiceSlug),
    message: options.initialMessage ?? "",
  }));
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<ContactFormStatus>("idle");

  const setField = useCallback(
    <K extends keyof ContactFormState>(key: K, value: ContactFormState[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        if (!(key in prev) || !prev[key as keyof ContactFieldErrors]) {
          return prev;
        }
        const next = { ...prev };
        delete next[key as keyof ContactFieldErrors];
        return next;
      });
      if (status === "success") {
        setStatus("idle");
      }
    },
    [status],
  );

  const submit = useCallback(() => {
    const nextErrors: ContactFieldErrors = {};
    const nameError = validateContactName(values.fullName);
    const emailError = validateContactEmail(values.email);
    const phoneError = validateContactPhone(values.phone);
    const messageError = validateContactMessage(values.message);

    if (nameError) {
      nextErrors.fullName = nameError;
    }
    if (emailError) {
      nextErrors.email = emailError;
    }
    if (phoneError) {
      nextErrors.phone = phoneError;
    }
    if (messageError) {
      nextErrors.message = messageError;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("idle");
      return { ok: false as const, errors: nextErrors };
    }

    const serviceLabel =
      CONTACT_SERVICE_OPTIONS.find((item) => item.value === values.serviceNeeded)?.label ??
      options.serviceName ??
      "Not specified";

    const subjectParts = ["Testimonydot enquiry"];
    if (serviceLabel && serviceLabel !== "Select a service (optional)") {
      subjectParts.push(serviceLabel);
    }
    const subject = subjectParts.join(" · ");
    const bodyLines = [
      `Name: ${values.fullName.trim()}`,
      `Email: ${values.email.trim()}`,
      `Phone: ${values.phone.trim()}`,
      `Service: ${serviceLabel}`,
      "",
      values.message.trim(),
    ];
    const body = bodyLines.join("\n");
    const to = getContactEmail();
    if (!to) {
      setErrors({
        form: "Email is not configured. Please reach us via phone or the details on this page.",
      });
      setStatus("idle");
      return { ok: false as const };
    }

    setStatus("submitting");
    const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setErrors({});
    setStatus("success");
    return { ok: true as const };
  }, [options.serviceName, values]);

  return { values, errors, status, setField, submit };
}
