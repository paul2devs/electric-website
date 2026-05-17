type StatCardProps = {
  label: string;
  value: string;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-sm border border-border bg-surface p-4">
      <span className="text-small text-muted">{label}</span>
      <span className="text-subtitle font-semibold text-ink">{value}</span>
    </div>
  );
}
