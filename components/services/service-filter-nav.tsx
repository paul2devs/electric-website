"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import {
  SERVICE_BROWSE_FILTERS,
  type ServiceBrowseFilterId,
} from "@/lib/services/browse-filter";

type ServiceFilterNavProps = {
  value: ServiceBrowseFilterId;
  onChange: (next: ServiceBrowseFilterId) => void;
};

export function ServiceFilterNav({ value, onChange }: ServiceFilterNavProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<ServiceBrowseFilterId, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const track = trackRef.current;
    const active = itemRefs.current.get(value);
    if (!track || !active) {
      return;
    }
    setIndicator({ left: active.offsetLeft, width: active.offsetWidth });
  }, [value]);

  return (
    <div className="border-b border-border/90 bg-white/90 backdrop-blur-md">
      <div className="relative px-8 sm:px-10 lg:px-12">
        <div
          ref={trackRef}
          className="scrollbar-hide relative flex gap-8 overflow-x-auto py-3 sm:gap-10"
          role="tablist"
          aria-label="Service categories"
        >
          {SERVICE_BROWSE_FILTERS.map((item) => {
            const active = item.id === value;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                ref={(node) => {
                  const map = itemRefs.current;
                  if (node) {
                    map.set(item.id, node);
                  } else {
                    map.delete(item.id);
                  }
                }}
                className={cn(
                  "relative shrink-0 whitespace-nowrap pb-2 text-small font-medium transition-colors duration-200",
                  active ? "text-ink" : "text-muted hover:text-ink/90",
                )}
                onClick={() => onChange(item.id)}
              >
                {item.label}
              </button>
            );
          })}
          <span
            className="pointer-events-none absolute bottom-0 left-0 h-px bg-ink transition-[transform,width] duration-200 ease-out"
            style={{
              width: Math.max(indicator.width, 0),
              transform: `translateX(${indicator.left}px)`,
            }}
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
