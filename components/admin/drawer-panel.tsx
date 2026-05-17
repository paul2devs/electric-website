import { Button } from "@/components/ui/button";

type DrawerPanelProps = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

export function DrawerPanel({ open, title, children, onClose }: DrawerPanelProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/10">
      <aside className="h-full w-full max-w-md overflow-y-auto border-l border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-subtitle font-semibold text-ink">{title}</h2>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="mt-6">{children}</div>
      </aside>
    </div>
  );
}
