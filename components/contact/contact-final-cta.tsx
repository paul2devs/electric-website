import Link from "next/link";

import { Container } from "@/components/layout/container";
import { buttonClassName } from "@/components/ui/button";
import { routes } from "@/lib/constants/routes";

export function ContactFinalCta() {
  return (
    <section className="section-gradient-muted">
      <Container className="px-8 py-20 sm:px-10 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-title font-semibold tracking-tight text-ink">
            Need help choosing a service?
          </h2>
          <p className="mt-3 text-body text-muted">
            Browse the structured catalogue or book directly when you know your programme.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href={routes.services} className={buttonClassName("primary", "justify-center")}>
              Browse services
            </Link>
            <Link href={routes.book} className={buttonClassName("secondary", "justify-center")}>
              Book a service
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
