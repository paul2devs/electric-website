import type { CookieOptions } from "express";

export const REFRESH_COOKIE_NAME = "refreshToken";

export function refreshCookieOptions(maxAgeMs: number): CookieOptions {
  const secure = process.env.COOKIE_SECURE === "true";
  return {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeMs,
  };
}

export const REFRESH_TOKEN_MS = 7 * 24 * 60 * 60 * 1000;
