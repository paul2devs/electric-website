import type { CookieOptions } from "express";
export declare const REFRESH_COOKIE_NAME = "refreshToken";
export declare function refreshCookieOptions(maxAgeMs: number): CookieOptions;
export declare const REFRESH_TOKEN_MS: number;
