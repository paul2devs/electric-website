import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/layout/container";
import { buttonClassName } from "@/components/ui/button";
import { HeroTitle } from "@/components/ui/hero-title";
import { routes } from "@/lib/constants/routes";
import { bookContactHref } from "@/lib/utils/book-contact-href";

export function HeroSection() {
  return (
    <section className="hero-shell-home relative isolate overflow-hidden border-b border-white/10">
      <Container className="relative px-8 py-20 sm:px-10 sm:py-24 lg:px-12 lg:py-28">
        <div className="services-hero-enter grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-2xl">
            <p className="text-small font-semibold uppercase tracking-[0.24em] text-white/80">
              Testimonydot
            </p>
            <h1 className="font-display mt-5 max-w-xl text-[2.5rem] font-semibold leading-[1.06] text-white sm:text-[2.75rem] lg:text-[3.25rem]">
              <HeroTitle lead="Professional electrical services," accent="done right." dark />
            </h1>
            <p className="mt-6 max-w-xl text-body font-medium leading-relaxed text-white/90">
              Book installations, repairs, and emergency services in minutes. Handled
              by experienced professionals with reliable scheduling and transparent
              pricing.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                className={buttonClassName("primary", "sm:w-auto w-full")}
                href={bookContactHref()}
              >
                Book a service
              </Link>
              <Link
                className={buttonClassName(
                  "secondary",
                  "sm:w-auto w-full border-white/25 bg-white/10 text-white hover:bg-white/15",
                )}
                href={routes.services}
              >
                View services
              </Link>
            </div>
          </div>
          <div className="relative isolate h-[23rem] overflow-hidden rounded-sm border border-white/15 shadow-[0_24px_80px_-30px_rgba(0,0,0,0.55)] sm:h-[26rem] lg:h-[30rem]">
            <Image
              src="/hero-electrician.svg"
              alt="Professional electrician at a residential service panel"
              fill
              className="object-cover opacity-90"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div
              className="absolute inset-0 bg-gradient-to-tr from-black/75 via-black/35 to-sky-900/40"
              aria-hidden
            />
            <div className="relative flex h-full items-end p-8 sm:p-10">
              <p className="max-w-sm font-display text-title font-semibold leading-tight text-white">
                Precision execution. Reliable timelines. Professional technicians.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
