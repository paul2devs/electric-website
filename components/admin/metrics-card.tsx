type MetricsCardProps = {
  label: string;
  value: string;
};

export function MetricsCard({ label, value }: MetricsCardProps) {
  return (
    <div className="border-b border-border pb-4">
      <p className="text-small text-muted">{label}</p>
      <p className="mt-1 text-subtitle font-semibold text-ink">{value}</p>
    </div>
  );
}
