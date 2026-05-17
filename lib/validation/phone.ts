export function countPhoneDigits(value: string): number {
  return value.replace(/\D/g, "").length;
}

export function validatePhoneRequired(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Phone number is required.";
  }
  const digits = countPhoneDigits(trimmed);
  if (digits < 10 || digits > 15) {
    return "Enter a valid phone number (10–15 digits).";
  }
  if (!/^[\d+\s().-]+$/.test(trimmed)) {
    return "Phone may only include digits, spaces, and + ( ) . -";
  }
  return null;
}

export function validatePhoneOptional(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  return validatePhoneRequired(trimmed);
}

export function normalizePhoneForStorage(value: string): string {
  return value.trim();
}
