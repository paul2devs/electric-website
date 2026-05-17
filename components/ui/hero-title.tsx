import { cn } from "@/lib/utils";

type HeroTitleProps = {
  lead: string;
  accent: string;
  className?: string;
  dark?: boolean;
};

export function HeroTitle({ lead, accent, className, dark }: HeroTitleProps) {
  return (
    <span className={className}>
      <span
        className={cn(
          "font-sans font-semibold tracking-[-0.03em]",
          dark ? "text-white" : "text-ink",
        )}
      >
        {lead}
      </span>{" "}
      <span
        className={cn(
          "font-display font-semibold italic tracking-[-0.02em]",
          dark ? "text-sky-300" : "bg-gradient-to-r from-[#3d6fd8] via-[#5b8def] to-[#7aa7f5] bg-clip-text text-transparent",
        )}
      >
        {accent}
      </span>
    </span>
  );
}
