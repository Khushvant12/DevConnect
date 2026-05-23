export default function SkillBadge({ label, variant = 'skill' }) {
  const styles =
    variant === 'tech'
      ? 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300'
      : 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles}`}
    >
      {label}
    </span>
  );
}
