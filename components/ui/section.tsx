import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionSpacing = "compact" | "default" | "roomy";

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  spacing?: SectionSpacing;
};

const spacingMap: Record<SectionSpacing, string> = {
  compact: "py-8",
  default: "py-12",
  roomy: "py-16",
};

export function Section({
  children,
  className,
  spacing = "default",
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(spacingMap[spacing], className)}
      {...props}
    >
      {children}
    </section>
  );
}
