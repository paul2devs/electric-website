import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type HeadingLevel = 1 | 2 | 3;

type HeadingProps = Omit<HTMLAttributes<HTMLHeadingElement>, "children"> & {
  level: HeadingLevel;
  children: ReactNode;
};

const styles: Record<HeadingLevel, string> = {
  1: "text-display font-bold tracking-tight text-ink",
  2: "text-title font-semibold tracking-tight text-ink",
  3: "text-subtitle font-semibold tracking-tight text-ink",
};

export function Heading({
  level,
  className,
  children,
  ...props
}: HeadingProps) {
  const merged = cn(styles[level], className);

  if (level === 1) {
    return (
      <h1 className={merged} {...props}>
        {children}
      </h1>
    );
  }

  if (level === 2) {
    return (
      <h2 className={merged} {...props}>
        {children}
      </h2>
    );
  }

  return (
    <h3 className={merged} {...props}>
      {children}
    </h3>
  );
}
