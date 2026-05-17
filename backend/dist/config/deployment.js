"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVercelRuntime = isVercelRuntime;
exports.isServerlessRuntime = isServerlessRuntime;
exports.shouldRunNotificationWorker = shouldRunNotificationWorker;
exports.shouldEnableRealtimeGateway = shouldEnableRealtimeGateway;
exports.getApiRoutePrefix = getApiRoutePrefix;
exports.getFrontendOrigins = getFrontendOrigins;
exports.getFrontendOrigin = getFrontendOrigin;
function stripQuotes(value) {
    return value.trim().replace(/^['"]+|['"]+$/g, "");
}
function isVercelRuntime() {
    return process.env.VERCEL === "1";
}
function isServerlessRuntime() {
    return isVercelRuntime() || process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined;
}
function shouldRunNotificationWorker() {
    if (process.env.NOTIFICATIONS_WORKER_ENABLED === "false") {
        return false;
    }
    if (process.env.NOTIFICATIONS_WORKER_ENABLED === "true") {
        return true;
    }
    return !isServerlessRuntime();
}
function shouldEnableRealtimeGateway() {
    if (process.env.REALTIME_ENABLED === "false") {
        return false;
    }
    if (process.env.REALTIME_ENABLED === "true") {
        return true;
    }
    return !isServerlessRuntime();
}
function getApiRoutePrefix() {
    const explicit = process.env.API_ROUTE_PREFIX?.trim();
    if (explicit) {
        return explicit.replace(/^\/+|\/+$/g, "");
    }
    if (isVercelRuntime()) {
        return "_/backend";
    }
    return undefined;
}
function getFrontendOrigins() {
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
        .filter((value) => Boolean(value?.trim()))
        .map((value) => stripQuotes(value).replace(/\/$/, ""));
    if (origins.length === 0 && process.env.NODE_ENV !== "production") {
        origins.push("http://localhost:3000");
    }
    return [...new Set(origins)];
}
function getFrontendOrigin() {
    const origins = getFrontendOrigins();
    if (origins.length === 0) {
        throw new Error("FRONTEND_ORIGIN is not configured. Set it to your deployed frontend URL (e.g. https://your-domain.com).");
    }
    return origins[0];
}
//# sourceMappingURL=deployment.js.map