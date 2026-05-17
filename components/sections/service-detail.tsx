import Link from "next/link";

import { Container } from "@/components/layout/container";
import { buttonClassName } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { routes } from "@/lib/constants/routes";
import {
  getRelatedServices,
  type ServiceRecord,
} from "@/lib/data/services";
import { bookContactHref, formatNgn } from "@/lib/utils";

type ServiceDetailProps = {
  service: ServiceRecord;
};

export function ServiceDetail({ service }: ServiceDetailProps) {
  const related = getRelatedServices(service);

  return (
    <Section spacing="compact">
      <Container className="flex flex-col gap-12">
        <header className="max-w-3xl">
          <Heading level={1}>{service.name}</Heading>
          <p className="mt-6 text-body text-muted leading-relaxed">
            {service.fullDescription}
          </p>
        </header>

        <Divider />

        <section aria-labelledby="included-heading">
          <Heading id="included-heading" level={2}>
            What&apos;s included
          </Heading>
          <ul className="mt-6 list-disc space-y-3 pl-6 text-body text-muted leading-relaxed">
            {service.whatsIncluded.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <Divider />

        <section aria-labelledby="logistics-heading">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <Heading id="logistics-heading" level={3}>
                Duration
              </Heading>
              <p className="mt-3 text-body text-muted leading-relaxed">
                {service.duration}
              </p>
            </div>
            <div>
              <Heading level={3}>Pricing preview</Heading>
              <p className="mt-3 text-body text-muted">
                Starting from{" "}
                <span className="font-medium text-ink">
                  {formatNgn(service.startingPriceNgn)}
                </span>
              </p>
            </div>
          </div>
        </section>

        {service.addOns.length > 0 ? (
          <>
            <Divider />
            <section aria-labelledby="addons-heading">
              <Heading id="addons-heading" level={2}>
                Add-ons
              </Heading>
              <ul className="mt-6 flex flex-col gap-6 border-t border-border">
                {service.addOns.map((addon) => (
                  <li
                    key={addon.name}
                    className="border-b border-border py-6 last:border-b-0"
                  >
                    <p className="text-body font-semibold text-ink">
                      {addon.name}
                    </p>
                    <p className="mt-2 text-small text-muted leading-relaxed">
                      {addon.description}
                    </p>
                    <p className="mt-3 text-small font-medium text-ink">
                      From {formatNgn(addon.startingPriceNgn)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <Link
            className={buttonClassName("primary")}
            href={bookContactHref(service.slug)}
          >
            Book this service
          </Link>
          <Link
            className={buttonClassName("secondary")}
            href={routes.services}
          >
            All services
          </Link>
        </div>

        {related.length > 0 ? (
          <>
            <Divider />
            <section aria-labelledby="related-heading">
              <Heading id="related-heading" level={2}>
                Related services
              </Heading>
              <ul className="mt-6 border-t border-border">
                {related.map((item) => (
                  <li key={item.slug} className="border-b border-border">
                    <Link
                      className="block py-4 text-body font-medium text-ink transition-colors duration-150 hover:bg-hover hover:text-muted"
                      href={routes.serviceDetail(item.slug)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : null}
      </Container>
    </Section>
  );
}
