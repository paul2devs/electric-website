"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { ServiceBrowseFilterId } from "@/lib/services/browse-filter";
import { filterServicesByBrowseId } from "@/lib/services/browse-filter";
import type { ServiceRecord } from "@/lib/data/services";

export function useServicesBrowse(gridServices: readonly ServiceRecord[]) {
  const [filterId, setFilterId] = useState<ServiceBrowseFilterId>("all");
  const [gridOpacity, setGridOpacity] = useState(1);
  const [detailSlug, setDetailSlug] = useState<string | null>(null);
  const filterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, []);

  const filteredServices = useMemo(
    () => filterServicesByBrowseId(gridServices, filterId),
    [gridServices, filterId],
  );

  const changeFilter = useCallback((next: ServiceBrowseFilterId) => {
    if (next === filterId) {
      return;
    }
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }
    setGridOpacity(0);
    filterTimeoutRef.current = setTimeout(() => {
      setFilterId(next);
      requestAnimationFrame(() => {
        setGridOpacity(1);
      });
      filterTimeoutRef.current = null;
    }, 170);
  }, [filterId]);

  const openDetail = useCallback((slug: string) => {
    setDetailSlug(slug);
  }, []);

  const closeDetail = useCallback(() => {
    setDetailSlug(null);
  }, []);

  return {
    filterId,
    changeFilter,
    filteredServices,
    gridOpacity,
    detailSlug,
    openDetail,
    closeDetail,
  };
}
