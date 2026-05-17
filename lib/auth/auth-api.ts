import { ApiError } from "@/lib/api/errors";
import { getApiBaseUrl } from "@/lib/constants/api";
import { fallbackAuthError, getFriendlyAuthError } from "@/lib/auth/error-message";

import { getAccessToken, setAccessToken } from "./access-token";
import type { AuthUser } from "./types";

export async function readErrorMessage(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const data = JSON.parse(text) as {
      message?: string | string[];
      error?: string;
      success?: boolean;
    };
    if (typeof data.error === "string") {
      return data.error;
    }
    if (typeof data.message === "string") {
      return data.message;
    }
    if (Array.isArray(data.message)) {
      return data.message.join(", ");
    }
  } catch {
    if (text && !text.trimStart().startsWith("<")) {
      return text;
    }
  }
  return fallbackAuthError;
}

export async function authLogin(
  email: string,
  password: string,
): Promise<{ accessToken: string; user: AuthUser }> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const message = getFriendlyAuthError(res.status, await readErrorMessage(res));
      throw new ApiError(res.status, message);
    }
    const data = (await res.json()) as { accessToken: string; user: AuthUser };
    setAccessToken(data.accessToken);
    return data;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(0, fallbackAuthError);
  }
}

export async function authRegister(
  name: string,
  email: string,
  phone: string,
  password: string,
  confirmPassword: string,
): Promise<{ user: AuthUser }> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password, confirmPassword }),
    });
    if (!res.ok) {
      const message = getFriendlyAuthError(res.status, await readErrorMessage(res));
      throw new ApiError(res.status, message);
    }
    return res.json() as Promise<{ user: AuthUser }>;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(0, fallbackAuthError);
  }
}

let refreshPromise: Promise<boolean> | null = null;

export function authRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          setAccessToken(null);
          return false;
        }
        const data = (await res.json()) as { accessToken: string };
        setAccessToken(data.accessToken);
        return true;
      } catch {
        setAccessToken(null);
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

export async function authLogout(): Promise<void> {
  try {
    await fetch(`${getApiBaseUrl()}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    setAccessToken(null);
  }
}

export async function authForgotPassword(email: string): Promise<{ message: string }> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/forgot-password`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const message = getFriendlyAuthError(res.status, await readErrorMessage(res));
      throw new ApiError(res.status, message);
    }
    return res.json() as Promise<{ message: string }>;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(0, fallbackAuthError);
  }
}

export async function authResetPassword(
  token: string,
  password: string,
): Promise<{ message: string }> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/reset-password`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    if (!res.ok) {
      const message = getFriendlyAuthError(res.status, await readErrorMessage(res));
      throw new ApiError(res.status, message);
    }
    return res.json() as Promise<{ message: string }>;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(0, fallbackAuthError);
  }
}

export async function fetchWithAuth(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const request = async (): Promise<Response> => {
    const token = getAccessToken();
    const headers = new Headers(init.headers ?? undefined);
    if (!headers.has("Content-Type") && init.body) {
      headers.set("Content-Type", "application/json");
    }
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return fetch(`${getApiBaseUrl()}${path}`, {
      ...init,
      credentials: "include",
      headers,
    });
  };

  let response = await request();
  if (response.status !== 401) {
    return response;
  }

  const refreshed = await authRefresh();
  if (!refreshed) {
    return response;
  }

  response = await request();
  return response;
}

export async function authMe(): Promise<AuthUser> {
  try {
    const res = await fetchWithAuth("/auth/me", {
      method: "GET",
    });
    if (!res.ok) {
      const message = getFriendlyAuthError(res.status, await readErrorMessage(res));
      throw new ApiError(res.status, message);
    }
    return res.json() as Promise<AuthUser>;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(0, fallbackAuthError);
  }
}
