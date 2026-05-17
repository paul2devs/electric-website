export type FieldErrors = Partial<Record<string, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Email is required.";
  }
  if (!emailPattern.test(trimmed)) {
    return "Enter a valid email address.";
  }
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) {
    return "Password is required.";
  }
  if (value.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (!/[A-Z]/.test(value)) {
    return "Password must include an uppercase letter.";
  }
  if (!/\d/.test(value)) {
    return "Password must include a number.";
  }
  return undefined;
}

export function passwordRequirementStatus(value: string) {
  return {
    minLength: value.length >= 8,
    uppercase: /[A-Z]/.test(value),
    number: /\d/.test(value),
  };
}

export function validateName(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Name is required.";
  }
  if (trimmed.length < 2) {
    return "Name must be at least 2 characters.";
  }
  return undefined;
}

export function validatePasswordMatch(
  password: string,
  confirm: string,
): string | undefined {
  if (password !== confirm) {
    return "Passwords do not match.";
  }
  return undefined;
}
