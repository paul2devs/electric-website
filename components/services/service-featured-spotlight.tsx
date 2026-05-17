import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { buttonClassName } from "@/components/ui/button";
import { routes } from "@/lib/constants/routes";
import { bookContactHref } from "@/lib/utils/book-contact-href";
import type { ServiceRecord } from "@/lib/data/services";
import { getServiceImageForRecord } from "@/lib/data/services";
import { cn } from "@/lib/utils";

const FEATURE_LINES = [
  "Full property coverage planning",
  "Clean cable management",
  "High-definition camera setup",
  "System configuration & testing",
] as const;

type ServiceFeaturedSpotlightProps = {
  service: ServiceRecord;
  imageSrc?: string;
};

export function ServiceFeaturedSpotlight({ service, imageSrc }: ServiceFeaturedSpotlightProps) {
  const visualSrc = imageSrc ?? getServiceImageForRecord(service);
  const bookHref = bookContactHref(service.slug);
  const detailHref = routes.serviceDetail(service.slug);

  return (
    <section className="border-b border-border bg-surface">
      <Container className="px-8 py-20 sm:px-10 sm:py-24 lg:px-12 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center lg:gap-16">
          <Link
            href={detailHref}
            className={cn(
              "group relative isolate block min-h-[16rem] overflow-hidden rounded-sm sm:min-h-[20rem] lg:min-h-[22rem]",
            )}
          >
            <Image
              src={visualSrc}
              alt={service.name}
              fill
              className="object-cover transition-[transform,filter] duration-500 ease-out group-hover:scale-[1.02] group-hover:brightness-[0.92]"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
            <div
              className="absolute inset-0 bg-ink/45 transition-colors duration-300 group-hover:bg-ink/55"
              aria-hidden
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10">
              <p className="text-small font-medium uppercase tracking-[0.14em] text-white/80">
                {service.name}
              </p>
              <p className="mt-2 max-w-md text-body leading-relaxed text-white/95">
                Structured security systems for modern properties.
              </p>
            </div>
          </Link>

          <div className="max-w-[26rem]">
            <p className="text-small font-medium uppercase tracking-[0.14em] text-muted">
              Featured Service
            </p>
            <h2 className="mt-3 text-title font-semibold leading-tight tracking-tight text-ink">
              Professional CCTV installation with structured system setup.
            </h2>
            <p className="mt-4 text-body leading-relaxed text-muted">
              We design and install surveillance systems tailored to your property layout,
              ensuring full coverage, clean installation, and long-term reliability.
            </p>
            <ul className="mt-8 space-y-3 border-t border-border pt-8 text-body text-ink">
              {FEATURE_LINES.map((line) => (
                <li key={line} className="leading-snug">
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href={bookHref} className={buttonClassName("primary", "w-full justify-center sm:w-auto")}>
                Book this service
              </Link>
              <Link
                href={detailHref}
                className={buttonClassName("secondary", "w-full justify-center sm:w-auto")}
              >
                View details →
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
