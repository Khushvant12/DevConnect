export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  loading = false,
  disabled,
  ...props
}) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger:
      'inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-red-700 active:scale-[0.98] disabled:opacity-60',
  };

  const sizes = {
    sm: 'px-3 py-2 text-xs',
    md: '',
    lg: 'px-6 py-3 text-base',
  };

  const base = variants[variant] || variants.primary;
  const sizeClass = size !== 'md' ? sizes[size] : '';

  return (
    <button
      type={type}
      className={`${base} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <span
            className={`h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current ${
              variant === 'secondary' || variant === 'ghost'
                ? 'border-slate-300 border-t-slate-600 dark:border-t-slate-300'
                : ''
            }`}
            aria-hidden="true"
          />
          <span>Loading…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
