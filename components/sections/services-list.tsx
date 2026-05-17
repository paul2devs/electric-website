import Link from "next/link";

import { FeaturedServiceBlock } from "@/components/sections/featured-service-block";
import { Container } from "@/components/layout/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { routes } from "@/lib/constants/routes";
import {
  getLandingFeaturedService,
  getLandingGridServices,
  getServiceImageForRecord,
} from "@/lib/data/services";

export function ServicesList() {
  const featured = getLandingFeaturedService();
  const gridItems = getLandingGridServices();

  return (
    <Section spacing="default" className="bg-white">
      <Container>
        <header className="max-w-3xl">
          <p className="text-small font-semibold uppercase tracking-[0.2em] text-muted">
            Testimonydot
          </p>
          <Heading level={2} className="mt-3">
            Services overview
          </Heading>
          <p className="mt-4 max-w-2xl text-body leading-relaxed text-muted">
            The same programmes you see on our services page — curated for quick orientation,
            then deep-linked when you need detail.
          </p>
        </header>

        <div className="mt-12">
          <FeaturedServiceBlock service={featured} imageSrc={getServiceImageForRecord(featured)} />
        </div>

        <div className="mt-14 border-t border-border pt-10">
          <ul className="divide-y divide-border">
            {gridItems.map((item) => (
              <li key={item.slug}>
                <Link
                  href={item.href}
                  className="group flex flex-col gap-1 py-6 transition-colors duration-150 hover:bg-hover sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 sm:px-2"
                >
                  <span className="text-subtitle font-semibold text-ink transition-colors duration-150 group-hover:text-accent">
                    {item.name}
                  </span>
                  <span className="max-w-xl text-small leading-relaxed text-muted transition-colors duration-150 group-hover:text-ink/80">
                    {item.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 border-t border-border pt-8">
          <Link
            href={routes.services}
            className="link-accent inline-flex text-body font-medium"
          >
            View all services
          </Link>
        </div>
      </Container>
    </Section>
  );
}
