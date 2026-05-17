import type { ReactNode } from "react";
import Link from "next/link";

import { Heading } from "@/components/ui/heading";
import { brandName } from "@/lib/constants/navigation";
import { routes } from "@/lib/constants/routes";

import { Container } from "./container";

type AuthShellProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
};

export function AuthShell({ children, title, subtitle }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-zinc-100 text-ink">
      <Container className="flex min-h-screen flex-col py-8">
        <Link
          href={routes.home}
          className="text-small font-semibold tracking-[0.24em] text-accent uppercase transition-opacity hover:opacity-80"
        >
          {brandName}
        </Link>
        <div className="flex flex-1 flex-col justify-center py-12">
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-xl border border-border bg-surface p-8 shadow-sm">
              <Heading level={1}>{title}</Heading>
            {subtitle ? (
                <p className="mt-3 text-body text-muted">{subtitle}</p>
            ) : null}
              <div className="mt-8">{children}</div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
