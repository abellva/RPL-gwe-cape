interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  accent?: string;
}

export function StatCard({ label, value, icon, accent = '#0D903A' }: StatCardProps) {
  return (
    <div className="bg-white border border-[#E0DEF7] rounded-[20px] p-6 flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0"
        style={{ backgroundColor: `${accent}15` }}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-[#000929] opacity-60">{label}</p>
        <p className="font-bold text-2xl text-[#000929]">{value}</p>
      </div>
    </div>
  );
}
