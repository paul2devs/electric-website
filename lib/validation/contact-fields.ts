export type ContactFieldErrors = Partial<
  Record<"fullName" | "email" | "phone" | "message" | "form", string>
>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactName(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Name is required.";
  }
  if (trimmed.length < 2) {
    return "Name must be at least 2 characters.";
  }
  return undefined;
}

export function validateContactEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Email is required.";
  }
  if (!emailPattern.test(trimmed)) {
    return "Enter a valid email address.";
  }
  return undefined;
}

export function validateContactPhone(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Phone is required.";
  }
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 10) {
    return "Enter a valid phone number.";
  }
  return undefined;
}

export function validateContactMessage(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Message is required.";
  }
  if (trimmed.length > 4000) {
    return "Message must be 4,000 characters or fewer.";
  }
  return undefined;
}
