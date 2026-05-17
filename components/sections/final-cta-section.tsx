import Link from "next/link";

import { Container } from "@/components/layout/container";
import { buttonClassName } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { finalCtaContent } from "@/lib/content/home-marketing";
import { routes } from "@/lib/constants/routes";
import { bookContactHref } from "@/lib/utils/book-contact-href";

export function FinalCTASection() {
  return (
    <Section spacing="roomy" className="bg-[#0e0e0e] text-white">
      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className="text-title font-semibold leading-tight tracking-tight text-white sm:text-3xl">
            {finalCtaContent.heading}
          </h2>
          <p className="mt-5 text-body leading-relaxed text-white/70">
            {finalCtaContent.subtext}
          </p>
          <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
            <Link
              className={buttonClassName("onDark", "w-full sm:w-auto")}
              href={bookContactHref()}
            >
              {finalCtaContent.primaryCta}
            </Link>
            <Link
              className={buttonClassName("onDarkOutline", "w-full sm:w-auto")}
              href={routes.services}
            >
              {finalCtaContent.secondaryCta}
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
