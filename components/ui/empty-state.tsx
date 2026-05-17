import type { ReactNode } from "react";
import Link from "next/link";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  ctaLabel,
  ctaHref,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[15rem] flex-col items-center justify-center rounded-sm border border-dashed border-border bg-surface px-6 py-10 text-center">
      <div className="mb-4 text-muted">{icon}</div>
      <p className="text-subtitle font-semibold text-ink">{title}</p>
      <p className="mt-2 max-w-md text-small leading-relaxed text-muted">{description}</p>
      {ctaLabel && ctaHref ? (
        <Link
          href={ctaHref}
          className="mt-5 text-small font-medium text-accent transition-colors hover:text-accent-hover"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
