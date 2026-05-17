"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { ProjectRecord } from "@/lib/data/projects";
import { filterProjectsByBrowseId } from "@/lib/projects/filter";
import type { ServiceBrowseFilterId } from "@/lib/services/browse-filter";

export function useProjectsBrowse(gridProjects: readonly ProjectRecord[]) {
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

  const filteredProjects = useMemo(
    () => filterProjectsByBrowseId(gridProjects, filterId),
    [gridProjects, filterId],
  );

  const changeFilter = useCallback(
    (next: ServiceBrowseFilterId) => {
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
    },
    [filterId],
  );

  const openDetail = useCallback((slug: string) => {
    setDetailSlug(slug);
  }, []);

  const closeDetail = useCallback(() => {
    setDetailSlug(null);
  }, []);

  return {
    filterId,
    changeFilter,
    filteredProjects,
    gridOpacity,
    detailSlug,
    openDetail,
    closeDetail,
  };
}
