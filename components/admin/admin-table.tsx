type AdminTableProps = {
  headers: string[];
  children: React.ReactNode;
  minWidthClass?: string;
};

export function AdminTable({ headers, children, minWidthClass = "min-w-[760px]" }: AdminTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${minWidthClass} border-t border-border`}>
        <thead>
          <tr className="border-b border-border text-left text-small text-muted">
            {headers.map((header) => (
              <th key={header} className="py-3 pr-4 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
