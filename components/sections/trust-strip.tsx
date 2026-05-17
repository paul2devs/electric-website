import { Container } from "@/components/layout/container";
import { Section } from "@/components/ui/section";

type TrustItem = {
  value: string;
  label: string;
};

const trustItems: TrustItem[] = [
  { value: "500+", label: "Jobs Completed" },
  { value: "10+", label: "Years Experience" },
  { value: "24/7", label: "Emergency Support" },
  { value: "Certified", label: "Technicians" },
];

export function TrustStrip() {
  return (
    <Section spacing="compact" className="border-b border-zinc-200 bg-[#F5F5F5]">
      <Container>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 py-2 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {trustItems.map((item) => (
            <div key={item.label} className="flex flex-col items-start justify-center gap-1">
              <p className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                {item.value}
              </p>
              <p className="text-small font-medium uppercase tracking-[0.14em] text-muted">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
