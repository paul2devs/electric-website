import { Divider } from "@/components/ui/divider";
import type { PricingResult } from "@/lib/bookings/types";
import { formatNgn } from "@/lib/utils";

type PricingPanelProps = {
  pricing: PricingResult | null;
  loading: boolean;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-small">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}

export function PricingPanel({ pricing, loading }: PricingPanelProps) {
  if (loading) {
    return <p className="text-small font-medium text-muted">Calculating price</p>;
  }

  if (!pricing) {
    return (
      <p className="text-small font-medium text-muted">Select service details to view pricing.</p>
    );
  }

  return (
    <aside className="border border-border bg-surface/80 p-5 shadow-sm">
      <h3 className="text-subtitle font-semibold tracking-tight text-ink">Pricing</h3>
      <p className="mt-2 text-small font-semibold text-ink">{pricing.serviceName}</p>
      <p className="text-[13px] font-medium uppercase tracking-wide text-muted">
        {pricing.serviceCategory.replace(/-/g, " ")}
      </p>
      <div className="mt-5 flex flex-col gap-3">
        <Row label="Base service" value={formatNgn(pricing.breakdown.base)} />
        <Row label="Urgency" value={`+${formatNgn(pricing.breakdown.urgency)}`} />
        <Row label="Distance" value={`+${formatNgn(pricing.breakdown.distance)}`} />
        <Row label="Add-ons" value={`+${formatNgn(pricing.breakdown.addons)}`} />
      </div>
      <Divider className="my-4" />
      <div className="flex items-center justify-between gap-4">
        <span className="text-body font-semibold text-ink">Total</span>
        <span className="text-body font-semibold text-ink">
          {formatNgn(pricing.breakdown.total)}
        </span>
      </div>
    </aside>
  );
}
