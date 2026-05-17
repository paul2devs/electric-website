"use client";

import { useCallback, useState } from "react";

export function useAccordionGroup(initialOpenSlug: string | null = null) {
  const [openSlug, setOpenSlug] = useState<string | null>(initialOpenSlug);

  const toggle = useCallback((slug: string) => {
    setOpenSlug((current) => (current === slug ? null : slug));
  }, []);

  const isSlugOpen = useCallback(
    (slug: string) => openSlug === slug,
    [openSlug],
  );

  return { toggle, isSlugOpen };
}
