import Image from "next/image";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

export type PageHeroVariant = "dark" | "light" | "soft";

export type PageHeroProps = {
  label: string;
  title: ReactNode;
  description: string;
  variant?: PageHeroVariant;
  imageSrc?: string;
  imageAlt?: string;
  align?: "left" | "center";
  children?: ReactNode;
  className?: string;
};

const variantShell: Record<PageHeroVariant, string> = {
  dark: "hero-shell-dark border-b border-white/10",
  light: "hero-shell-light border-b border-border",
  soft: "hero-shell-soft border-b border-border",
};

const variantLabel: Record<PageHeroVariant, string> = {
  dark: "text-white/80",
  light: "text-muted",
  soft: "text-muted",
};

const variantBody: Record<PageHeroVariant, string> = {
  dark: "text-white/90",
  light: "text-muted",
  soft: "text-muted",
};

export function PageHero({
  label,
  title,
  description,
  variant = "soft",
  imageSrc,
  imageAlt,
  align = "left",
  children,
  className,
}: PageHeroProps) {
  const isDark = variant === "dark";
  const centered = align === "center";

  return (
    <section className={cn("relative isolate overflow-hidden", variantShell[variant], className)}>
      {imageSrc ? (
        <>
          <Image
            src={imageSrc}
            alt={imageAlt ?? ""}
            fill
            priority
            className={cn(
              "object-cover",
              isDark ? "opacity-35 mix-blend-soft-light" : "opacity-20",
            )}
            sizes="100vw"
          />
          <div
            className={cn(
              "absolute inset-0",
              isDark ? "bg-gradient-to-t from-black/85 via-black/45 to-black/25" : "bg-gradient-to-r from-white/90 via-white/70 to-transparent",
            )}
            aria-hidden
          />
        </>
      ) : null}
      <Container
        className={cn(
          "relative px-8 py-20 sm:px-10 sm:py-24 lg:px-12 lg:py-28",
          centered && "text-center",
        )}
      >
        <div
          className={cn(
            "services-hero-enter max-w-3xl",
            centered && "mx-auto",
            imageSrc &&
              !isDark &&
              "lg:grid lg:max-w-none lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center lg:gap-16",
          )}
        >
          <div className={cn(centered && "mx-auto")}>
            <p
              className={cn(
                "font-sans text-small font-semibold uppercase tracking-[0.24em]",
                variantLabel[variant],
              )}
            >
              {label}
            </p>
            <h1
              className={cn(
                "font-display mt-4 text-[2.25rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[2.5rem] lg:text-[2.75rem]",
                isDark ? "text-white" : "text-ink",
              )}
            >
              {title}
            </h1>
            <p
              className={cn(
                "mt-4 max-w-[36rem] font-sans text-[1rem] leading-relaxed sm:text-[1.0625rem]",
                variantBody[variant],
                centered && "mx-auto",
              )}
            >
              {description}
            </p>
            {children ? (
              <div
                className={cn(
                  "mt-6 flex flex-col gap-3 sm:flex-row sm:items-center",
                  centered && "justify-center",
                )}
              >
                {children}
              </div>
            ) : null}
          </div>
          {imageSrc && !isDark ? (
            <div className="card-gradient-surface relative mt-10 aspect-[4/3] overflow-hidden rounded-sm border border-border lg:mt-0">
              <Image
                src={imageSrc}
                alt={imageAlt ?? ""}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
