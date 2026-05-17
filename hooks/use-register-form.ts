"use client";

import { useCallback, useState } from "react";

import type { FieldErrors } from "@/lib/validation/auth-fields";
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordMatch,
} from "@/lib/validation/auth-fields";
import { validatePhoneRequired } from "@/lib/validation/phone";

export type RegisterFormState = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};

const initialState: RegisterFormState = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  acceptedTerms: false,
};

export function useRegisterForm() {
  const [values, setValues] = useState<RegisterFormState>(initialState);
  const [errors, setErrors] = useState<FieldErrors>({});

  const setField = useCallback(
    <K extends keyof RegisterFormState>(
      key: K,
      value: RegisterFormState[K],
    ) => {
      setValues((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        if (!prev[key]) {
          return prev;
        }
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [],
  );

  const reset = useCallback(() => {
    setValues(initialState);
    setErrors({});
  }, []);

  const submit = useCallback(() => {
    const nextErrors: FieldErrors = {};
    const nameError = validateName(values.name);
    const emailError = validateEmail(values.email);
    const phoneError = validatePhoneRequired(values.phone);
    const passwordError = validatePassword(values.password);
    const matchError = validatePasswordMatch(
      values.password,
      values.confirmPassword,
    );

    if (nameError) {
      nextErrors.name = nameError;
    }
    if (emailError) {
      nextErrors.email = emailError;
    }
    if (phoneError) {
      nextErrors.phone = phoneError;
    }
    if (passwordError) {
      nextErrors.password = passwordError;
    }
    if (matchError) {
      nextErrors.confirmPassword = matchError;
    }
    if (!values.acceptedTerms) {
      nextErrors.acceptedTerms = "You must accept the Terms of Service and Privacy Policy.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return { ok: false as const, errors: nextErrors };
    }

    setErrors({});
    return { ok: true as const, values: { ...values } };
  }, [values]);

  return {
    values,
    errors,
    setField,
    reset,
    submit,
  };
}
