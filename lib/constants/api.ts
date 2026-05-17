import { getPublicAppOrigin } from "@/lib/constants/app-origin";

function stripQuotes(value: string): string {
  return value.trim().replace(/^['"]+|['"]+$/g, "");
}

function normalizeApiBase(value: string): string {
  const trimmed = stripQuotes(value).replace(/\/$/, "");
  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("/")) {
    if (typeof window !== "undefined") {
      return `${window.location.origin}${trimmed}`;
    }
    return `${getPublicAppOrigin()}${trimmed}`;
  }

  return trimmed;
}

function readConfiguredApiBase(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_API_URL,
    process.env.NEXT_PUBLIC_API_BASE_URL,
    process.env.NEXT_PUBLIC_BACKEND_URL,
  ];

  for (const raw of candidates) {
    if (!raw) {
      continue;
    }
    const normalized = normalizeApiBase(raw);
    if (normalized) {
      return normalized;
    }
  }

  return "";
}

/**
 * Base URL for the Nest API (no trailing slash).
 * Production on Vercel Services: prefers NEXT_PUBLIC_API_URL, then NEXT_PUBLIC_BACKEND_URL (e.g. /_/backend).
 * Development: http://localhost:3001 when unset.
 */
export function getApiBaseUrl(): string {
  const configured = readConfiguredApiBase();
  if (configured) {
    return configured;
  }

  if (process.env.VERCEL === "1") {
    return normalizeApiBase("/_/backend");
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "API base URL is not configured. Set NEXT_PUBLIC_API_URL (e.g. https://your-domain.com/_/backend).",
    );
  }

  return "http://localhost:3001";
}
