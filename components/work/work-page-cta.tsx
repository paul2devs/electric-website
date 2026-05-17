import Link from "next/link";

import { Container } from "@/components/layout/container";
import { buttonClassName } from "@/components/ui/button";
import { routes } from "@/lib/constants/routes";

export function WorkPageCta() {
  return (
    <section className="border-b border-border bg-surface">
      <Container className="px-8 py-20 sm:px-10 sm:py-24 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[32rem] text-center">
          <h2 className="text-title font-semibold tracking-tight text-ink">Like what you see?</h2>
          <p className="mt-3 text-body leading-relaxed text-muted">
            Book a structured service visit or speak with operations about a similar scope for your
            property.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href={routes.book} className={buttonClassName("primary", "w-full justify-center sm:w-auto")}>
              Book a service
            </Link>
            <Link
              href={routes.contact}
              className={buttonClassName("secondary", "w-full justify-center sm:w-auto")}
            >
              Discuss a project
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
