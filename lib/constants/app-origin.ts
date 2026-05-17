function stripQuotes(value: string): string {
  return value.trim().replace(/^['"]+|['"]+$/g, "");
}

function normalizeOrigin(value: string): string {
  return stripQuotes(value).replace(/\/$/, "");
}

/**
 * Public site origin for metadata, SSR absolute URLs, and resolving relative API paths.
 */
export function getPublicAppOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) {
    return normalizeOrigin(explicit);
  }

  if (process.env.VERCEL_URL) {
    return `https://${normalizeOrigin(process.env.VERCEL_URL)}`;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "NEXT_PUBLIC_APP_URL is not configured. Set it to your production site URL on Vercel.",
    );
  }

  return "http://localhost:3000";
}
