import type { ServiceRecord } from "@/lib/data/services";

type ContactBookingBannerProps = {
  service: ServiceRecord;
};

export function ContactBookingBanner({ service }: ContactBookingBannerProps) {
  return (
    <div className="border border-border px-4 py-4">
      <p className="text-small font-medium text-ink">Booking request</p>
      <p className="mt-1 text-small text-muted">
        Service selected: {service.name}
      </p>
    </div>
  );
}
