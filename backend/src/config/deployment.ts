function stripQuotes(value: string): string {
  return value.trim().replace(/^['"]+|['"]+$/g, "");
}

export function isVercelRuntime(): boolean {
  return process.env.VERCEL === "1";
}

export function isServerlessRuntime(): boolean {
  return isVercelRuntime() || process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined;
}

export function shouldRunNotificationWorker(): boolean {
  if (process.env.NOTIFICATIONS_WORKER_ENABLED === "false") {
    return false;
  }
  if (process.env.NOTIFICATIONS_WORKER_ENABLED === "true") {
    return true;
  }
  return !isServerlessRuntime();
}

export function shouldEnableRealtimeGateway(): boolean {
  if (process.env.REALTIME_ENABLED === "false") {
    return false;
  }
  if (process.env.REALTIME_ENABLED === "true") {
    return true;
  }
  return !isServerlessRuntime();
}

/** Only set when explicitly configured. Render deploys routes at root (e.g. /auth/login). */
export function getApiRoutePrefix(): string | undefined {
  const explicit = process.env.API_ROUTE_PREFIX?.trim();
  if (!explicit) {
    return undefined;
  }
  return explicit.replace(/^\/+|\/+$/g, "");
}

export function getFrontendOrigins(): string[] {
  const values = [
    process.env.FRONTEND_ORIGIN,
    process.env.FRONTEND_URL,
    process.env.NEXT_PUBLIC_APP_URL,
  ];

  if (process.env.VERCEL_URL) {
    values.push(`https://${stripQuotes(process.env.VERCEL_URL)}`);
  }

  if (process.env.VERCEL_BRANCH_URL) {
    values.push(`https://${stripQuotes(process.env.VERCEL_BRANCH_URL)}`);
  }

  const origins = values
    .filter((value): value is string => Boolean(value?.trim()))
    .map((value) => stripQuotes(value).replace(/\/$/, ""));

  if (origins.length === 0 && process.env.NODE_ENV !== "production") {
    origins.push("http://localhost:3000");
  }

  return [...new Set(origins)];
}

export function getFrontendOrigin(): string {
  const origins = getFrontendOrigins();
  if (origins.length === 0) {
    throw new Error(
      "FRONTEND_ORIGIN is not configured. Set it to your deployed frontend URL (e.g. https://your-domain.com).",
    );
  }
  return origins[0];
}
