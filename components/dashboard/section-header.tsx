import { Heading } from "@/components/ui/heading";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
};

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <Heading level={2}>{title}</Heading>
      {subtitle ? (
        <p className="text-small text-muted leading-relaxed">{subtitle}</p>
      ) : null}
    </div>
  );
}
