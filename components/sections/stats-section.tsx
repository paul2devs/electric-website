import { Container } from "@/components/layout/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { formatCount } from "@/lib/utils/format-count";

const yearsExperience = 14;
const jobsCompleted = 5200;

export function StatsSection() {
  return (
    <Section spacing="default" className="bg-zinc-900 text-white">
      <Container>
        <Heading level={2}>Why choose Testimonydot</Heading>
        <div className="mt-10 flex flex-col gap-12 md:flex-row md:gap-16">
          <div className="flex-1">
            <p className="text-display font-bold text-white">
              {yearsExperience}+
            </p>
            <p className="mt-2 text-small font-medium text-zinc-300 uppercase tracking-wide">
              Years in the field
            </p>
          </div>
          <div className="flex-1">
            <p className="text-display font-bold text-white">
              {formatCount(jobsCompleted)}+
            </p>
            <p className="mt-2 text-small font-medium text-zinc-300 uppercase tracking-wide">
              Jobs completed
            </p>
          </div>
          <div className="flex-1">
            <p className="text-subtitle font-semibold text-white leading-snug">
              NEMSA-aware procedures
            </p>
            <p className="mt-2 text-small text-zinc-300 leading-relaxed">
              Supervised licensed crews · Documented testing and handover packs on
              every engagement
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
