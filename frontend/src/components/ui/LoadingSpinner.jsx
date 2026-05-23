export default function LoadingSpinner({ size = 'md', label = 'Loading', className = '' }) {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-9 w-9 border-[3px]',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className={`animate-spin rounded-full border-slate-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400 ${sizes[size]}`}
        aria-hidden="true"
      />
      {label && (
        <span className="sr-only">{label}</span>
      )}
    </div>
  );
}
