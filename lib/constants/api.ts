function stripQuotes(value: string): string {
  return value.trim().replace(/^['"]+|['"]+$/g, "");
}

function normalizeApiBase(value: string): string {
  return stripQuotes(value).replace(/\/$/, "");
}

function readConfiguredApiBase(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_API_URL,
    process.env.NEXT_PUBLIC_API_BASE_URL,
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

function assertValidProductionApiUrl(url: string): void {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  if (url.startsWith("/") || url.includes("/_/backend")) {
    throw new Error(
      "NEXT_PUBLIC_API_URL must be the full Render backend URL (e.g. https://your-api.onrender.com). " +
        "Do not use /_/backend or relative paths — the API is not hosted on Vercel.",
    );
  }

  if (url.includes("localhost")) {
    throw new Error(
      "NEXT_PUBLIC_API_URL cannot point to localhost in production. Use your Render backend URL.",
    );
  }

  if (!url.startsWith("https://") && !url.startsWith("http://")) {
    throw new Error(
      "NEXT_PUBLIC_API_URL must be an absolute URL including https:// (your Render backend).",
    );
  }
}

/**
 * Base URL for the Nest API on Render (no trailing slash).
 * All auth and API calls use this — never Vercel /_/backend routes.
 */
export function getApiBaseUrl(): string {
  const configured = readConfiguredApiBase();
  if (configured) {
    assertValidProductionApiUrl(configured);
    return configured;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Add your Render backend URL in Vercel → Environment Variables " +
        "(e.g. https://your-service.onrender.com), then redeploy.",
    );
  }

  return "http://localhost:3001";
}
