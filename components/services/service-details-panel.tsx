"use client";

import Link from "next/link";
import { useEffect } from "react";

import { buttonClassName } from "@/components/ui/button";
import { routes } from "@/lib/constants/routes";
import { bookContactHref } from "@/lib/utils/book-contact-href";
import { cn } from "@/lib/utils";
import type { ServiceRecord } from "@/lib/data/services";

type ServiceDetailsPanelProps = {
  service: ServiceRecord | null;
  open: boolean;
  onClose: () => void;
};

export function ServiceDetailsPanel({ service, open, onClose }: ServiceDetailsPanelProps) {
  useEffect(() => {
    if (!open) {
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !service) {
    return null;
  }

  const bookHref = bookContactHref(service.slug);
  const askHref = `${routes.contact}?topic=question`;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-ink/35 transition-opacity duration-300"
        aria-label="Close service details"
        onClick={onClose}
      />
      <aside
        className={cn(
          "service-panel-aside relative flex h-full w-full max-w-[min(100vw,28rem)] flex-col border-l border-border bg-surface shadow-[0_0_0_1px_rgba(0,0,0,0.04)]",
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-panel-title"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <h2 id="service-panel-title" className="text-subtitle font-semibold tracking-tight text-ink">
              {service.name}
            </h2>
            <p className="mt-1 text-small text-muted">{service.shortDescription}</p>
          </div>
          <button
            type="button"
            className="rounded-sm px-2 py-1 text-small font-medium text-muted transition-colors hover:bg-hover hover:text-ink"
            onClick={onClose}
          >
            Close
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <section className="space-y-2">
            <h3 className="text-small font-semibold uppercase tracking-[0.12em] text-muted">
              Overview
            </h3>
            <p className="text-body leading-relaxed text-ink">{service.fullDescription}</p>
          </section>

          <hr className="my-6 border-border" />

          <section className="space-y-3">
            <h3 className="text-small font-semibold uppercase tracking-[0.12em] text-muted">
              What&apos;s included
            </h3>
            <ul className="space-y-2 text-body text-ink">
              {service.whatsIncluded.map((line) => (
                <li key={line} className="leading-snug">
                  {line}
                </li>
              ))}
            </ul>
          </section>

          <hr className="my-6 border-border" />

          <section className="space-y-3">
            <h3 className="text-small font-semibold uppercase tracking-[0.12em] text-muted">
              Pricing structure
            </h3>
            <p className="text-body leading-relaxed text-muted">
              Pricing depends on:
            </p>
            <ul className="list-disc space-y-1 pl-5 text-body text-ink">
              <li>Property size</li>
              <li>Scope of equipment and materials</li>
              <li>Installation complexity</li>
              <li>Urgency level</li>
            </ul>
          </section>

          <hr className="my-6 border-border" />

          <section className="space-y-2">
            <h3 className="text-small font-semibold uppercase tracking-[0.12em] text-muted">
              Service timeframe
            </h3>
            <p className="text-body leading-relaxed text-ink">Typical completion: {service.duration}</p>
          </section>

          {service.addOns.length > 0 ? (
            <>
              <hr className="my-6 border-border" />
              <section className="space-y-3">
                <h3 className="text-small font-semibold uppercase tracking-[0.12em] text-muted">
                  Optional add-ons
                </h3>
                <ul className="space-y-2 text-body text-ink">
                  {service.addOns.map((addon) => (
                    <li key={addon.name} className="leading-snug">
                      {addon.name}
                    </li>
                  ))}
                </ul>
              </section>
            </>
          ) : null}
        </div>

        <footer className="shrink-0 border-t border-border bg-surface px-6 py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Link href={bookHref} className={buttonClassName("primary", "w-full justify-center sm:w-auto")}>
              Book this service
            </Link>
            <Link
              href={askHref}
              className={buttonClassName("secondary", "w-full justify-center sm:w-auto")}
            >
              Ask a question
            </Link>
          </div>
        </footer>
      </aside>
    </div>
  );
}
