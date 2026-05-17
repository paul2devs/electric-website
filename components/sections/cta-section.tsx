import Link from "next/link";

import { Container } from "@/components/layout/container";
import { buttonClassName } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { bookContactHref } from "@/lib/utils/book-contact-href";

export function CTASection() {
  return (
    <Section spacing="compact" className="border-t border-border bg-zinc-50">
      <Container>
        <div className="flex flex-col gap-6 py-4 md:flex-row md:items-center md:justify-between">
          <p className="text-title font-semibold text-ink">
            Ready to get professional support today?
          </p>
          <Link className={buttonClassName("primary", "md:w-auto w-full")} href={bookContactHref()}>
            Start booking
          </Link>
        </div>
      </Container>
    </Section>
  );
}
