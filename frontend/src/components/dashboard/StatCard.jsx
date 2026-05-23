export default function StatCard({ label, value, hint, accent = 'brand' }) {
  const accentMap = {
    brand: 'text-brand-600 dark:text-brand-400',
    violet: 'text-violet-600 dark:text-violet-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    amber: 'text-amber-600 dark:text-amber-400',
  };

  return (
    <div className="card">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${accentMap[accent] || accentMap.brand}`}>
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
