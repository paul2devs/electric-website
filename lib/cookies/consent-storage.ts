export type CookieConsentValue = "accepted" | "rejected";

const STORAGE_KEY = "testimonydot.cookie.consent.v1";

export function readCookieConsent(): CookieConsentValue | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === "accepted" || raw === "rejected") {
      return raw;
    }
    return null;
  } catch {
    return null;
  }
}

export function writeCookieConsent(value: CookieConsentValue): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* private mode */
  }
}

export function clearCookieConsent(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
}
