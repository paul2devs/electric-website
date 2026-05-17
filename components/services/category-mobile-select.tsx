"use client";

import { useRouter } from "next/navigation";

import { routes } from "@/lib/constants/routes";
import {
  SERVICE_CATEGORIES,
  type ServiceCategoryId,
} from "@/lib/data/services";

type CategoryMobileSelectProps = {
  activeCategoryId: ServiceCategoryId | "all";
};

const selectClass =
  "w-full rounded-sm border border-border bg-surface px-3 py-2 text-body text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

export function CategoryMobileSelect({
  activeCategoryId,
}: CategoryMobileSelectProps) {
  const router = useRouter();

  return (
    <label className="flex flex-col gap-2 lg:hidden">
      <span className="text-small font-medium text-ink">Category</span>
      <select
        className={selectClass}
        value={activeCategoryId}
        onChange={(event) => {
          const value = event.target.value;
          if (value === "all") {
            router.push(routes.services);
            return;
          }
          router.push(`${routes.services}?category=${value}`);
        }}
      >
        <option value="all">All categories</option>
        {SERVICE_CATEGORIES.map((category) => (
          <option key={category.id} value={category.id}>
            {category.label}
          </option>
        ))}
      </select>
    </label>
  );
}
