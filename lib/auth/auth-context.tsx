"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  authLogin as apiLogin,
  authLogout as apiLogout,
  authMe,
  authRefresh,
  authRegister as apiRegister,
} from "@/lib/auth/auth-api";
import type { AuthUser } from "@/lib/auth/types";

export type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  const refreshSession = useCallback(async () => {
    const ok = await authRefresh();
    if (!ok) {
      setUser(null);
      return false;
    }
    try {
      const nextUser = await authMe();
      setUser(nextUser);
      return true;
    } catch {
      setUser(null);
      return false;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ok = await authRefresh();
      if (cancelled) {
        return;
      }
      if (ok) {
        try {
          const nextUser = await authMe();
          if (!cancelled) {
            setUser(nextUser);
          }
        } catch {
          if (!cancelled) {
            setUser(null);
          }
        }
      } else if (!cancelled) {
        setUser(null);
      }
      if (!cancelled) {
        setIsReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: nextUser } = await apiLogin(email, password);
    setUser(nextUser);
  }, []);

  const register = useCallback(
    async (
      name: string,
      email: string,
      phone: string,
      password: string,
      confirmPassword: string,
    ) => {
      await apiRegister(name, email, phone, password, confirmPassword);
    },
    [],
  );

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isReady,
      login,
      register,
      logout,
      refreshSession,
    }),
    [user, isReady, login, register, logout, refreshSession],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("AuthProvider is required");
  }
  return ctx;
}
