import Link from "next/link";

import { Container } from "@/components/layout/container";
import {
  getContactMailtoHref,
  getContactPhoneDisplay,
  getContactPhoneHref,
  siteContact,
} from "@/lib/constants/site-contact";
import { routes } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

const cardClass =
  "card-gradient-surface group flex flex-col border border-border p-6 transition-[border-color,box-shadow,background] duration-200 hover:border-accent/30 hover:shadow-sm sm:p-8";

export function ContactOptions() {
  const phoneDisplay = getContactPhoneDisplay();
  const emergencyHref = `${routes.book}?serviceId=emergency-call-out`;

  return (
    <section className="border-b border-border bg-surface">
      <Container className="px-8 py-16 sm:px-10 sm:py-20 lg:px-12">
        <p className="text-small text-muted">We typically respond within a few hours during service hours.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className={cardClass}>
            <span className="text-small font-semibold uppercase tracking-[0.12em] text-muted">
              Call
            </span>
            <p className="mt-3 text-body font-medium text-ink">Speak directly with operations</p>
            <Link
              href={getContactPhoneHref()}
              className="mt-4 text-body font-semibold text-accent underline-offset-2 hover:underline"
            >
              {phoneDisplay ?? "Call us"}
            </Link>
          </div>
          <div className={cardClass}>
            <span className="text-small font-semibold uppercase tracking-[0.12em] text-muted">
              Email
            </span>
            <p className="mt-3 text-body font-medium text-ink">Send your request anytime</p>
            <Link
              href={getContactMailtoHref()}
              className={cn(
                "mt-4 break-all text-body font-semibold text-accent underline-offset-2 hover:underline",
              )}
            >
              {siteContact.email}
            </Link>
          </div>
          <div className={cardClass}>
            <span className="text-small font-semibold uppercase tracking-[0.12em] text-muted">
              Emergency
            </span>
            <p className="mt-3 text-body font-medium text-ink">Urgent electrical support</p>
            <Link
              href={emergencyHref}
              className="mt-4 text-body font-semibold text-ink underline-offset-2 hover:text-accent hover:underline"
            >
              Request emergency service →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
