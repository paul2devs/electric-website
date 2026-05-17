import Image from "next/image";
import Link from "next/link";

import { buttonClassName } from "@/components/ui/button";
import { bookContactHref } from "@/lib/utils/book-contact-href";
import { formatNgn } from "@/lib/utils/format-currency";
import { routes } from "@/lib/constants/routes";
import type { ServiceRecord } from "@/lib/data/services";

type FeaturedServiceBlockProps = {
  service: ServiceRecord;
  imageSrc: string;
};

export function FeaturedServiceBlock({ service, imageSrc }: FeaturedServiceBlockProps) {
  const detailHref = routes.serviceDetail(service.slug);
  const bookHref = bookContactHref(service.slug);

  return (
    <div className="group relative isolate min-h-[17.5rem] overflow-hidden rounded-2xl border border-border sm:min-h-[20rem] lg:min-h-[22.5rem]">
      <Image
        src={imageSrc}
        alt={service.name}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        sizes="(max-width: 1024px) 100vw, 100vw"
        priority
      />
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden
      />
      <div className="relative flex h-full min-h-[17.5rem] flex-col justify-end p-8 sm:min-h-[20rem] sm:p-10 lg:min-h-[22.5rem] lg:p-12">
        <p className="text-small font-medium uppercase tracking-[0.18em] text-white/80">
          Featured
        </p>
        <h3 className="mt-3 max-w-xl text-title font-semibold leading-tight tracking-tight text-white sm:text-3xl">
          {service.name}
        </h3>
        <p className="mt-3 max-w-xl text-body leading-relaxed text-white/90">
          {service.shortDescription}
        </p>
        <p className="mt-4 text-small font-medium text-white/85">
          From {formatNgn(service.startingPriceNgn)}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link className={buttonClassName("primary", "w-full sm:w-auto")} href={bookHref}>
            Book service
          </Link>
          <Link
            className={buttonClassName(
              "secondary",
              "w-full border-white/40 bg-white/10 text-white backdrop-blur-sm hover:border-white/60 hover:bg-white/15 sm:w-auto",
            )}
            href={detailHref}
          >
            Service details
          </Link>
        </div>
      </div>
    </div>
  );
}
