"use client";

import { Divider } from "@/components/ui/divider";
import { ServiceImage } from "@/components/ui/service-image";
import type { PricingResult } from "@/lib/bookings/types";
import type { EnrichedBackendService } from "@/lib/services/service-media";
import { cn, formatNgn } from "@/lib/utils";

type BookingSummaryPanelProps = {
  service: EnrichedBackendService | null;
  date: string;
  time: string;
  pricing: PricingResult | null;
  pricingLoading: boolean;
  inspiredBy?: string;
  className?: string;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-small">
      <span className="text-muted">{label}</span>
      <span className="max-w-[60%] text-right font-medium text-ink">{value}</span>
    </div>
  );
}

export function BookingSummaryPanel({
  service,
  date,
  time,
  pricing,
  pricingLoading,
  inspiredBy,
  className,
}: BookingSummaryPanelProps) {
  const formattedDate = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString("en-NG", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <aside
      className={cn(
        "border border-border bg-[#fafafa] p-6 lg:sticky lg:top-24",
        className,
      )}
    >
      <h2 className="text-small font-semibold uppercase tracking-[0.12em] text-muted">
        Summary
      </h2>
      {service ? (
        <ServiceImage
          src={service.imageUrl}
          alt={service.name}
          className="mt-6 aspect-[16/9] w-full rounded-sm"
          sizes="22rem"
        />
      ) : null}
      <div className="mt-6 space-y-4">
        <Row label="Service" value={service?.name ?? "Not selected"} />
        <Row
          label="Date & time"
          value={date && time ? `${formattedDate} · ${time}` : date ? formattedDate : "—"}
        />
        {inspiredBy ? <Row label="Inspired by" value={inspiredBy} /> : null}
      </div>
      <Divider className="my-6" />
      <div className="space-y-3">
        {pricingLoading ? (
          <p className="text-small text-muted">Calculating estimate…</p>
        ) : pricing ? (
          <>
            <Row label="Base" value={formatNgn(pricing.breakdown.base)} />
            {pricing.breakdown.urgency > 0 ? (
              <Row label="Urgency" value={`+${formatNgn(pricing.breakdown.urgency)}`} />
            ) : null}
            {pricing.breakdown.distance > 0 ? (
              <Row label="Distance" value={`+${formatNgn(pricing.breakdown.distance)}`} />
            ) : null}
            {pricing.breakdown.addons > 0 ? (
              <Row label="Add-ons" value={`+${formatNgn(pricing.breakdown.addons)}`} />
            ) : null}
            <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
              <span className="text-body font-semibold text-ink">Estimated total</span>
              <span className="text-body font-semibold text-ink">
                {formatNgn(pricing.breakdown.total)}
              </span>
            </div>
          </>
        ) : (
          <p className="text-small text-muted">Select a service to see pricing.</p>
        )}
      </div>
      <p className="mt-6 text-[13px] leading-relaxed text-muted">
        Final amount is confirmed after scope review. You will receive email confirmation.
      </p>
    </aside>
  );
}
