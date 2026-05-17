import Link from "next/link";

import { HeroTitle } from "@/components/ui/hero-title";
import { buttonClassName } from "@/components/ui/button";
import { routes } from "@/lib/constants/routes";

import { ServiceHeroUiMock } from "./service-hero-ui-mock";

export function ServicePageHero() {
  return (
    <section className="hero-shell-dark relative isolate overflow-hidden border-b border-white/10">
      <div className="px-8 pb-16 pt-20 sm:px-10 sm:pb-24 sm:pt-24 lg:px-12">
        <div className="services-hero-enter mx-auto grid max-w-content gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center lg:gap-16">
          <div>
            <p className="text-small font-semibold uppercase tracking-[0.22em] text-white/80">
              Services
            </p>
            <h1 className="font-display mt-4 max-w-[34rem] text-[2.25rem] font-semibold leading-[1.12] tracking-[-0.03em] text-white sm:text-[2.5rem] lg:text-[2.75rem]">
              <HeroTitle
                lead="Professional electrical services,"
                accent="structured for every need."
                dark
              />
            </h1>
            <p className="mt-4 max-w-[36rem] text-[1rem] leading-relaxed text-white/90 sm:text-[1.0625rem]">
              From installations to repairs and advanced systems, every service is organized to help
              you find exactly what you need — quickly and efficiently.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#services-catalogue"
                className={buttonClassName(
                  "secondary",
                  "w-full justify-center border-white/25 bg-white/10 text-white hover:bg-white/15 sm:w-auto",
                )}
              >
                Browse services
              </a>
              <Link
                href={routes.book}
                className={buttonClassName("primary", "w-full justify-center sm:w-auto")}
              >
                Book a service
              </Link>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <ServiceHeroUiMock />
          </div>
        </div>
      </div>
    </section>
  );
}
