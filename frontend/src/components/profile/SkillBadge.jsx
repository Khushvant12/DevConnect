const variants = {
  skill: {
    className:
      'bg-brand-50 text-brand-800 ring-1 ring-brand-200/60 dark:bg-brand-950/50 dark:text-brand-300 dark:ring-brand-800/60',
    dot: 'bg-brand-500',
  },
  tech: {
    className:
      'bg-violet-50 text-violet-800 ring-1 ring-violet-200/60 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-800/50',
    dot: 'bg-violet-500',
  },
  neutral: {
    className:
      'bg-slate-100 text-slate-700 ring-1 ring-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
    dot: 'bg-slate-400',
  },
};

export default function SkillBadge({ label, variant = 'skill', size = 'md' }) {
  const v = variants[variant] || variants.skill;
  const sizes =
    size === 'sm'
      ? 'px-2 py-0.5 text-[11px] gap-1'
      : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-lg font-medium capitalize transition-colors ${sizes} ${v.className}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${v.dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}
