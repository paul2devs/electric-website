import Link from "next/link";

import { Container } from "@/components/layout/container";
import { buttonClassName } from "@/components/ui/button";
import { routes } from "@/lib/constants/routes";

export function ServicePageFinalCta() {
  return (
    <section className="border-b border-border bg-[#f9f9f9]">
      <Container className="px-8 py-20 sm:px-10 sm:py-24 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[32rem] text-center">
          <h2 className="text-title font-semibold tracking-tight text-ink">
            Ready to schedule your service?
          </h2>
          <p className="mt-3 text-body leading-relaxed text-muted">
            Choose your service, pick a time, and get it handled by a qualified technician without
            delays.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-3">
            <Link href={routes.book} className={buttonClassName("primary", "w-full justify-center sm:w-auto")}>
              Book a service
            </Link>
            <Link
              href={`${routes.contact}?topic=choose-service`}
              className={buttonClassName("secondary", "w-full justify-center sm:w-auto")}
            >
              Need help choosing a service?
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
