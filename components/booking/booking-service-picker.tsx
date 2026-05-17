"use client";

import type { EnrichedBackendService } from "@/lib/services/service-media";
import { ServiceImage } from "@/components/ui/service-image";
import { formatNgn } from "@/lib/utils";
import { cn } from "@/lib/utils";

type BookingServicePickerProps = {
  services: EnrichedBackendService[];
  selectedServiceId: string;
  loading: boolean;
  onSelect: (serviceId: string) => void;
};

export function BookingServicePicker({
  services,
  selectedServiceId,
  loading,
  onSelect,
}: BookingServicePickerProps) {
  const selected = services.find((s) => s.id === selectedServiceId);

  return (
    <div className="flex flex-col gap-6">
      {selected ? (
        <div className="card-gradient-surface flex items-center gap-4 rounded-sm border border-border p-4">
          <ServiceImage
            src={selected.imageUrl}
            alt={selected.name}
            className="h-16 w-16 shrink-0 rounded-sm"
            sizes="64px"
          />
          <p className="text-small text-muted">
            Selected: <span className="font-semibold text-ink">{selected.name}</span>
          </p>
        </div>
      ) : (
        <p className="text-small text-muted">Select a service to continue.</p>
      )}

      {loading ? (
        <p className="text-small text-muted">Loading services…</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {services.map((service) => {
            const active = service.id === selectedServiceId;
            return (
              <li key={service.id}>
                <button
                  type="button"
                  className={cn(
                    "card-gradient-surface group flex w-full gap-4 rounded-sm border p-4 text-left transition-[border-color,box-shadow,transform] duration-200",
                    active
                      ? "border-accent/50 shadow-[0_0_0_1px_rgba(91,141,239,0.35)]"
                      : "border-border hover:border-accent/30 hover:shadow-sm",
                  )}
                  onClick={() => onSelect(service.id)}
                >
                  <ServiceImage
                    src={service.imageUrl}
                    alt={service.name}
                    className="h-20 w-20 shrink-0 rounded-sm"
                    imageClassName="transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="80px"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-body font-semibold text-ink">
                      {service.name}
                    </span>
                    <span className="mt-1 block text-small text-muted">
                      {service.duration} min · from {formatNgn(service.basePrice)}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
