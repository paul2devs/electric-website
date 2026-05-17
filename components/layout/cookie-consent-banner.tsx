"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { routes } from "@/lib/constants/routes";
import {
  readCookieConsent,
  writeCookieConsent,
  type CookieConsentValue,
} from "@/lib/cookies/consent-storage";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setVisible(readCookieConsent() === null);
    });
  }, []);

  const choose = (value: CookieConsentValue) => {
    writeCookieConsent(value);
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-border bg-surface/95 p-4 shadow-[0_-8px_32px_rgba(0,0,0,0.08)] backdrop-blur-md sm:p-5"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-content flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p id="cookie-consent-title" className="text-body font-semibold text-ink">
            Cookies on Testimonydot
          </p>
          <p className="mt-2 text-small leading-relaxed text-muted">
            We use essential cookies to keep you signed in and remember your preferences. Optional
            analytics may be added later. Read our{" "}
            <Link href={routes.cookies} className="link-accent">
              Cookie Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button type="button" variant="secondary" onClick={() => choose("rejected")}>
            Reject optional
          </Button>
          <Button type="button" variant="primary" onClick={() => choose("accepted")}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
