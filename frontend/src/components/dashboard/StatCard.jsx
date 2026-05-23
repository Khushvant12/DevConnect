export default function StatCard({ label, value, hint, accent = 'brand' }) {
  const accentMap = {
    brand: 'from-brand-500 to-brand-600',
    violet: 'from-violet-500 to-violet-600',
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
  };

  const gradient = accentMap[accent] || accentMap.brand;

  return (
    <div className="card group transition-all duration-200 hover:shadow-card-hover">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`mt-2 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent ${gradient}`}>
        {value}
      </p>
      {hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
