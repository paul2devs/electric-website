import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { HeroTitle } from "@/components/ui/hero-title";
import { PageHero } from "@/components/ui/page-hero";
import { buttonClassName } from "@/components/ui/button";
import {
  ABOUT_BRAND_STATEMENT,
  ABOUT_PROCESS_MINDSET,
  ABOUT_SERVICE_PILLARS,
  ABOUT_STATS,
  ABOUT_VALUES,
  ABOUT_VISUAL_IMAGE,
} from "@/lib/data/about-content";
import { routes } from "@/lib/constants/routes";

export function AboutPageExperience() {
  return (
    <>
      <PageHero
        label="About"
        variant="dark"
        align="center"
        imageSrc={ABOUT_VISUAL_IMAGE}
        imageAlt="Professional electrical operations"
        title={
          <HeroTitle
            lead="Structured electrical services built on"
            accent="precision and reliability."
            dark
          />
        }
        description="Testimonydot provides professional electrical solutions designed for real-world performance — from installations to advanced systems."
      />

      <section className="border-b border-border bg-surface">
        <Container className="max-w-2xl px-8 py-16 text-center sm:px-10 sm:py-20 lg:px-12">
          <p className="text-body leading-relaxed text-ink">{ABOUT_BRAND_STATEMENT}</p>
        </Container>
      </section>

      <section className="border-b border-border section-gradient-muted">
        <Container className="px-8 py-16 sm:px-10 sm:py-20 lg:px-12">
          <h2 className="text-subtitle font-semibold tracking-tight text-ink">What we do</h2>
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_SERVICE_PILLARS.map((pillar) => (
              <li key={pillar.label} className="border-t border-border pt-4">
                <p className="text-body font-semibold text-ink">{pillar.label}</p>
                <p className="mt-2 text-small leading-relaxed text-muted">{pillar.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-b border-border bg-surface">
        <Container className="px-8 py-16 sm:px-10 sm:py-20 lg:px-12">
          <h2 className="text-subtitle font-semibold tracking-tight text-ink">How we work</h2>
          <ul className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-x-10">
            {ABOUT_PROCESS_MINDSET.map((line) => (
              <li key={line} className="text-body font-medium text-ink">
                {line}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-b border-border section-gradient-surface">
        <Container className="px-8 py-16 sm:px-10 sm:py-20 lg:px-12">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_STATS.map((stat) => (
              <li key={stat.label} className="text-center sm:text-left">
                <p className="font-display text-[2.5rem] font-medium italic leading-none text-accent">
                  {stat.value}
                </p>
                <p className="mt-2 text-small font-medium uppercase tracking-[0.1em] text-muted">
                  {stat.label}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-b border-border bg-surface">
        <Container className="px-8 py-16 sm:px-10 sm:py-20 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-border bg-hover">
              <Image
                src={ABOUT_VISUAL_IMAGE}
                alt="Controlled electrical work environment"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="max-w-md">
              <h2 className="text-subtitle font-semibold tracking-tight text-ink">
                Built for real sites
              </h2>
              <p className="mt-4 text-body leading-relaxed text-muted">
                We document scope, supervise execution, and close every programme with clear
                handover — the standard facilities teams expect.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border section-gradient-muted">
        <Container className="px-8 py-16 sm:px-10 sm:py-20 lg:px-12">
          <h2 className="text-subtitle font-semibold tracking-tight text-ink">Values</h2>
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_VALUES.map((value) => (
              <li key={value.title}>
                <p className="text-body font-semibold text-ink">{value.title}</p>
                <p className="mt-2 text-small leading-relaxed text-muted">{value.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="section-gradient-surface">
        <Container className="px-8 py-20 sm:px-10 sm:py-24 lg:px-12">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-title font-semibold tracking-tight text-ink">
              Ready to schedule your service?
            </h2>
            <Link
              href={routes.book}
              className={buttonClassName("primary", "mt-8 inline-flex justify-center")}
            >
              Book now
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
