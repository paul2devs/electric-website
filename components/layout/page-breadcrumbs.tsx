"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Container } from "@/components/layout/container";
import {
  adminBreadcrumbs,
  dashboardBreadcrumbs,
  marketingBreadcrumbs,
} from "@/lib/navigation/breadcrumbs";
import { cn } from "@/lib/utils";

type BreadcrumbVariant = "marketing" | "dashboard" | "admin";

type PageBreadcrumbsProps = {
  variant: BreadcrumbVariant;
};

export function PageBreadcrumbs({ variant }: PageBreadcrumbsProps) {
  const pathname = usePathname();
  const items =
    variant === "marketing"
      ? marketingBreadcrumbs(pathname)
      : variant === "dashboard"
        ? dashboardBreadcrumbs(pathname)
        : adminBreadcrumbs(pathname);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="border-b border-border bg-surface">
      <Container className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 px-8 py-3 text-small sm:px-10 lg:px-12")}>
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <span key={`${item.href}-${index}`} className="inline-flex items-center gap-2">
              {index > 0 ? <span className="text-muted">/</span> : null}
              {last ? (
                <span className="font-medium text-ink" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="font-medium text-muted transition-colors hover:text-ink">
                  {item.label}
                </Link>
              )}
            </span>
          );
        })}
      </Container>
    </nav>
  );
}
