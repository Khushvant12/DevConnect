export default function TechBadge({ label }) {
  return (
    <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
      {label}
    </span>
  );
}
