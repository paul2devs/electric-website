type ActionMenuProps = {
  actions: Array<{ label: string; onClick: () => void }>;
};

export function ActionMenu({ actions }: ActionMenuProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          className="text-small font-medium underline"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
