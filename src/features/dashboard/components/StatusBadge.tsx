const statusStyles: Record<string, string> = {
  pending: 'bg-[#FF852D]',
  confirmed: 'bg-[#0D903A]',
  cancelled: 'bg-[#FF2D2D]',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-4 py-1 text-xs font-bold text-white uppercase ${statusStyles[status] ?? 'bg-[#FF852D]'}`}
    >
      {status}
    </span>
  );
}

export function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    admin: 'bg-[#0D903A]',
    office_provider: 'bg-[#FF852D]',
    user: 'bg-[#000929]',
  };
  const labels: Record<string, string> = {
    admin: 'Admin',
    office_provider: 'Provider',
    user: 'Customer',
  };
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold text-white ${styles[role] ?? 'bg-[#000929]'}`}>
      {labels[role] ?? role}
    </span>
  );
}
