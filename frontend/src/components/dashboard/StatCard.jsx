export default function StatCard({ label, value, hint, accent = 'brand' }) {
  const accentMap = {
    brand: 'from-brand-400 to-brand-600 dark:from-brand-400 dark:to-brand-500',
    violet: 'from-violet-500 to-fuchsia-600',
    emerald: 'from-emerald-400 to-teal-600',
    amber: 'from-amber-400 to-orange-500',
  };

  const hoverMap = {
    brand: 'hover:border-brand-500/20 hover:shadow-glow',
    violet: 'hover:border-violet-500/20 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.15)]',
    emerald: 'hover:border-emerald-500/20 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.15)]',
    amber: 'hover:border-amber-500/20 hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.15)]',
  };

  const gradient = accentMap[accent] || accentMap.brand;
  const hoverStyle = hoverMap[accent] || hoverMap.brand;

  return (
    <div className={`glass-card p-6 transition-all duration-300 ${hoverStyle}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
      <p className={`mt-2 bg-gradient-to-r bg-clip-text text-3xl font-extrabold text-transparent ${gradient}`}>
        {value}
      </p>
      {hint && <p className="mt-1 text-[10px] font-medium text-slate-400 dark:text-slate-500">{hint}</p>}
    </div>
  );
}
