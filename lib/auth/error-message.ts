export const fallbackAuthError = "Something went wrong. Please try again.";

export const invalidCredentialsMessage = "Invalid email or password";

export function getFriendlyAuthError(status: number, message: string): string {
  if (status === 503) {
    const trimmed = message.trim();
    if (trimmed.length > 0) {
      return trimmed;
    }
    return "Service temporarily unavailable. Please try again.";
  }
  if (status >= 500) {
    return fallbackAuthError;
  }
  if (!message.trim()) {
    return status === 401 ? invalidCredentialsMessage : fallbackAuthError;
  }
  const lowered = message.toLowerCase();
  if (
    lowered.includes("internal server error") ||
    lowered.includes("unexpected error") ||
    lowered.includes("something went wrong")
  ) {
    return fallbackAuthError;
  }
  if (
    status === 401 ||
    lowered.includes("invalid credentials") ||
    lowered.includes("invalid email or password") ||
    lowered === "unauthorized"
  ) {
    return invalidCredentialsMessage;
  }
  return message;
}
