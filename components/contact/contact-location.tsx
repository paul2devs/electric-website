import Image from "next/image";

import { Container } from "@/components/layout/container";
import { siteContact } from "@/lib/constants/site-contact";

export function ContactLocation() {
  return (
    <section className="border-b border-border bg-surface">
      <Container className="px-8 py-16 sm:px-10 sm:py-20 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="max-w-md">
            <h2 className="text-subtitle font-semibold tracking-tight text-ink">Coverage</h2>
            <p className="mt-3 text-body leading-relaxed text-muted">{siteContact.coverageLine}</p>
            <p className="mt-4 text-body font-medium text-ink">
              Serving Lagos and surrounding areas with structured mobilisation for residential and
              commercial sites.
            </p>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-border bg-hover">
            <Image
              src="/marketing-contact.svg"
              alt="Service coverage across Lagos"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
