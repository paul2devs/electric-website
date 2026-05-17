"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFRESH_TOKEN_MS = exports.REFRESH_COOKIE_NAME = void 0;
exports.refreshCookieOptions = refreshCookieOptions;
exports.REFRESH_COOKIE_NAME = "refreshToken";
function refreshCookieOptions(maxAgeMs) {
    const secure = process.env.COOKIE_SECURE === "true";
    return {
        httpOnly: true,
        secure,
        sameSite: "lax",
        path: "/",
        maxAge: maxAgeMs,
    };
}
exports.REFRESH_TOKEN_MS = 7 * 24 * 60 * 60 * 1000;
//# sourceMappingURL=cookie.js.map