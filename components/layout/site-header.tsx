"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { buttonClassName } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { brandName } from "@/lib/constants/navigation";
import { routes } from "@/lib/constants/routes";
import { siteHeaderNav } from "@/lib/constants/site-navigation";
import { bookContactHref } from "@/lib/utils/book-contact-href";
import { cn } from "@/lib/utils";

const headerHeightClass = "h-[4.25rem] sm:h-[4.5rem]";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-4 w-5" aria-hidden>
      <span
        className={cn(
          "absolute left-0 top-0 block h-0.5 w-full rounded-full bg-ink transition-transform duration-200",
          open ? "translate-y-1.5 rotate-45" : "",
        )}
      />
      <span
        className={cn(
          "absolute left-0 top-1.5 block h-0.5 w-full rounded-full bg-ink transition-opacity duration-200",
          open ? "opacity-0" : "opacity-100",
        )}
      />
      <span
        className={cn(
          "absolute left-0 top-3 block h-0.5 w-full rounded-full bg-ink transition-transform duration-200",
          open ? "-translate-y-1.5 -rotate-45" : "",
        )}
      />
    </span>
  );
}

const navLinkBase =
  "text-small decoration-1 underline-offset-[6px] transition-[color,text-decoration-color,font-weight] duration-200";

function navLinkClassName(active: boolean): string {
  return cn(
    navLinkBase,
    active
      ? "font-semibold text-accent underline decoration-accent/45"
      : "font-medium text-ink/80 decoration-transparent hover:text-ink hover:underline hover:decoration-ink/25",
  );
}

function isNavItemActive(pathname: string, href: string): boolean {
  if (href.includes("#")) {
    const [path] = href.split("#");
    return pathname === path || pathname === `${path}/`;
  }
  if (href === routes.home) {
    return pathname === routes.home;
  }
  if (href === routes.services) {
    return pathname === routes.services || pathname.startsWith(`${routes.services}/`);
  }
  return pathname === href || pathname === `${href}/`;
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    queueMicrotask(() => {
      setMenuOpen(false);
    });
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-[background-color,box-shadow,backdrop-filter,border-color] duration-300",
          scrolled
            ? "border-black/[0.08] bg-white/92 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-md"
            : "border-transparent bg-white/55 backdrop-blur-md",
        )}
      >
        <Container className={cn("flex items-center justify-between gap-6 px-8 sm:px-10 lg:px-12", headerHeightClass)}>
          <Link
            href={routes.home}
            className="shrink-0 text-[0.95rem] font-semibold tracking-[-0.02em] text-ink"
          >
            {brandName}
          </Link>

          <nav
            aria-label="Primary"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex"
          >
            {siteHeaderNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={navLinkClassName(isNavItemActive(pathname, item.href))}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-7 lg:flex">
            <Link
              href={routes.login}
              className={navLinkClassName(pathname === routes.login || pathname === `${routes.login}/`)}
            >
              Login
            </Link>
            <Link
              href={bookContactHref()}
              className={buttonClassName(
                "primary",
                "px-3.5 py-2 text-small shadow-none hover:shadow-sm",
              )}
            >
              Book a service
            </Link>
          </div>

          <button
            type="button"
            className="flex items-center justify-center rounded-sm p-2 text-ink lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-panel"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </Container>
      </header>

      <div
        id="mobile-nav-panel"
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-ink/20 backdrop-blur-[2px] transition-opacity duration-300",
            menuOpen ? "opacity-100" : "opacity-0",
          )}
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-y-0 right-0 flex w-full max-w-[20rem] flex-col border-l border-border bg-surface shadow-[0_0_0_1px_rgba(0,0,0,0.04)] transition-transform duration-300 ease-out",
            menuOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className={cn("flex items-center justify-end border-b border-border px-6", headerHeightClass)}>
            <button
              type="button"
              className="rounded-sm p-2 text-ink"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <MenuIcon open />
            </button>
          </div>
          <nav aria-label="Mobile primary" className="flex flex-col gap-1 px-6 py-6">
            {siteHeaderNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "border-b border-border/80 py-3 text-body font-medium",
                  isNavItemActive(pathname, item.href) ? "text-accent" : "text-ink",
                )}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={routes.login}
              className={cn(
                "border-b border-border/80 py-3 text-body font-medium",
                pathname === routes.login ? "text-accent" : "text-ink",
              )}
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href={bookContactHref()}
              className={cn(
                buttonClassName("primary", "mt-4 w-full justify-center py-2.5"),
              )}
              onClick={() => setMenuOpen(false)}
            >
              Book a service
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
