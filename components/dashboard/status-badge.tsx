import { cn } from "@/lib/utils";

type Status = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";

const statusLabels: Record<Status, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusClass: Record<Status, string> = {
  pending: "text-muted border-border",
  confirmed: "text-ink border-ink",
  in_progress: "text-accent border-accent",
  completed: "text-success border-success",
  cancelled: "text-muted border-border",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-1 text-small font-medium",
        statusClass[status],
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
