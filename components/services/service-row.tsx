"use client";

import Link from "next/link";

import { buttonClassName } from "@/components/ui/button";
import type { ServiceRecord } from "@/lib/data/services";
import { bookContactHref, cn, formatNgn } from "@/lib/utils";

type ServiceRowProps = {
  service: ServiceRecord;
  isOpen: boolean;
  onToggle: (slug: string) => void;
};

export function ServiceRow({ service, isOpen, onToggle }: ServiceRowProps) {
  return (
    <div className="border-b border-border">
      <button
        type="button"
        className="flex w-full items-start justify-between gap-4 py-6 text-left transition-colors duration-150 hover:bg-zinc-50"
        aria-expanded={isOpen}
        onClick={() => onToggle(service.slug)}
      >
        <span className="min-w-0">
          <span className="block text-body font-semibold text-ink">
            {service.name}
          </span>
          <span className="mt-2 block text-small text-muted leading-relaxed">
            {service.shortDescription}
          </span>
        </span>
        <span
          className={cn(
            "mt-1 shrink-0 text-small text-muted transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0",
          )}
          aria-hidden
        >
          ▼
        </span>
      </button>
      <div
        className="accordion-panel"
        data-state={isOpen ? "open" : "closed"}
      >
        <div className="accordion-panel-inner">
          <div className="space-y-6 border-t border-border pb-6 pt-4">
            <p className="text-body text-muted leading-relaxed">
              {service.fullDescription}
            </p>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-small font-medium text-ink">Duration</dt>
                <dd className="mt-1 text-small text-muted leading-relaxed">
                  {service.duration}
                </dd>
              </div>
              <div>
                <dt className="text-small font-medium text-ink">
                  Starting price
                </dt>
                <dd className="mt-1 text-small text-muted">
                  From {formatNgn(service.startingPriceNgn)}
                </dd>
              </div>
            </dl>
            <Link
              className={buttonClassName("primary")}
              href={bookContactHref(service.slug)}
            >
              Book now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
