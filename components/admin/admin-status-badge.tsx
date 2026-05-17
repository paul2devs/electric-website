import { cn } from "@/lib/utils";

const classMap: Record<string, string> = {
  pending: "text-muted border-border",
  confirmed: "text-ink border-ink",
  assigned: "text-ink border-ink",
  in_progress: "text-accent border-accent",
  completed: "text-success border-success",
  cancelled: "text-muted border-border",
  available: "text-ink border-ink",
  busy: "text-warning border-warning",
  offline: "text-muted border-border",
  admin: "text-ink border-ink",
  user: "text-muted border-border",
  new: "text-accent border-accent",
  read: "text-muted border-border",
  archived: "text-muted border-border",
};

export function AdminStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-1 text-small font-medium",
        classMap[status] ?? "text-muted border-border",
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}
