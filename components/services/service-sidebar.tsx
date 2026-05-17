import Link from "next/link";

import { routes } from "@/lib/constants/routes";
import {
  SERVICE_CATEGORIES,
  type ServiceCategoryId,
} from "@/lib/data/services";
import { cn } from "@/lib/utils";

import { CategoryMobileSelect } from "./category-mobile-select";

type ServiceSidebarProps = {
  activeCategoryId: ServiceCategoryId | "all";
};

const linkBase =
  "block rounded-sm px-3 py-2 text-small font-medium transition-colors duration-150";
const linkIdle = "text-muted hover:bg-hover hover:text-ink";
const linkActive = "bg-hover text-ink";

export function ServiceSidebar({ activeCategoryId }: ServiceSidebarProps) {
  return (
    <div className="flex w-full flex-col gap-6 lg:w-60 lg:shrink-0">
      <CategoryMobileSelect activeCategoryId={activeCategoryId} />
      <nav
        aria-label="Service categories"
        className="hidden flex-col gap-1 lg:flex"
      >
        <Link
          href={routes.services}
          className={cn(
            linkBase,
            activeCategoryId === "all" ? linkActive : linkIdle,
          )}
        >
          All services
        </Link>
        {SERVICE_CATEGORIES.map((category) => (
          <Link
            key={category.id}
            href={`${routes.services}?category=${category.id}`}
            className={cn(
              linkBase,
              activeCategoryId === category.id ? linkActive : linkIdle,
            )}
          >
            {category.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
