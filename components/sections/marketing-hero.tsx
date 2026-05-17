import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { buttonClassName } from "@/components/ui/button";
import type { ReactNode } from "react";

export type MarketingHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function MarketingHero({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: MarketingHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      <div
        className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-indigo-950 to-black"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(99,102,241,0.35),transparent_55%),radial-gradient(ellipse_at_80%_40%,rgba(59,130,246,0.25),transparent_50%)]"
        aria-hidden
      />
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={imageAlt ?? ""}
          fill
          priority
          className="object-cover opacity-35 mix-blend-soft-light"
          sizes="100vw"
        />
      ) : null}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
        aria-hidden
      />
      <Container className="relative flex flex-col gap-8 py-16 sm:gap-10 sm:py-20 lg:py-28">
        <div className="max-w-3xl">
          <p className="text-small font-semibold uppercase tracking-[0.28em] text-white/75">
            {eyebrow}
          </p>
          <h1 className="mt-5 max-w-3xl text-[2.25rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.75rem] lg:text-[3rem]">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-body font-medium leading-relaxed text-white/90">
            {description}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link className={buttonClassName("onDark", "w-full sm:w-auto")} href={primaryHref}>
            {primaryLabel}
          </Link>
          {secondaryHref && secondaryLabel ? (
            <Link
              className={buttonClassName("onDarkOutline", "w-full sm:w-auto")}
              href={secondaryHref}
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
