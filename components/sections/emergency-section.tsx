import Link from "next/link";

import { Container } from "@/components/layout/container";
import { buttonClassName } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { getSupportCallHref } from "@/lib/constants/support-contact";
import { emergencySupportContent } from "@/lib/content/home-marketing";
import { bookContactHref } from "@/lib/utils/book-contact-href";

export function EmergencySection() {
  const callHref = getSupportCallHref();

  return (
    <Section spacing="default" className="border-b border-border bg-[#161616] text-white">
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-0">
          <div className="max-w-xl lg:flex-1 lg:pr-12">
            <p className="text-small font-semibold uppercase tracking-[0.2em] text-warning-muted">
              Priority response
            </p>
            <h2 className="mt-4 text-title font-semibold leading-tight tracking-tight text-white sm:text-3xl">
              {emergencySupportContent.title}
            </h2>
            <ul className="mt-8 flex list-none flex-col gap-3 p-0 text-body text-white/85">
              {emergencySupportContent.conditions.map((item) => (
                <li
                  key={item}
                  className="border-l-2 border-warning/50 pl-4 text-small leading-relaxed sm:text-body"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-small leading-relaxed text-white/65 sm:text-body">
              {emergencySupportContent.supporting}
            </p>
          </div>

          <div className="hidden w-px shrink-0 self-stretch bg-white/12 lg:block" aria-hidden />

          <div className="flex flex-col justify-center lg:flex-1 lg:pl-12">
            <div className="rounded-xl border border-white/10 bg-white/[0.06] p-8 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.65)] transition-shadow duration-200 hover:shadow-[0_28px_56px_-20px_rgba(0,0,0,0.55)]">
              <p className="text-small font-semibold uppercase tracking-[0.18em] text-warning-muted">
                Concierge
              </p>
              <h3 className="mt-3 text-subtitle font-semibold text-white">
                {emergencySupportContent.cardTitle}
              </h3>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  className={buttonClassName(
                    "primary",
                    "w-full border-0 bg-warning text-white shadow-sm hover:brightness-110 hover:shadow-md sm:w-auto",
                  )}
                  href={bookContactHref()}
                >
                  {emergencySupportContent.primaryCta}
                </Link>
                <Link
                  className={buttonClassName(
                    "onDarkOutline",
                    "w-full border-warning/45 text-warning-muted hover:border-warning/70 hover:bg-warning/10 sm:w-auto",
                  )}
                  href={callHref}
                >
                  {emergencySupportContent.secondaryCta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
