"use client";

import { useCallback, useState } from "react";

import type { FieldErrors } from "@/lib/validation/auth-fields";
import {
  validateEmail,
  validatePassword,
} from "@/lib/validation/auth-fields";

export type LoginFormState = {
  email: string;
  password: string;
};

const initialState: LoginFormState = {
  email: "",
  password: "",
};

export function useLoginForm() {
  const [values, setValues] = useState<LoginFormState>(initialState);
  const [errors, setErrors] = useState<FieldErrors>({});

  const setField = useCallback(
    <K extends keyof LoginFormState>(key: K, value: LoginFormState[K]) => {
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
    const emailError = validateEmail(values.email);
    const passwordError = validatePassword(values.password);

    if (emailError) {
      nextErrors.email = emailError;
    }
    if (passwordError) {
      nextErrors.password = passwordError;
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
